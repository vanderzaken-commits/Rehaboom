import {createHash, createHmac, randomBytes, timingSafeEqual} from 'node:crypto';
import {BlobPreconditionFailedError, del, get, list, put} from '@vercel/blob';
import webPush from 'web-push';

const idPattern = /^[a-f0-9]{32}$/;
const base64url = /^[\w-]+$/;
const noCache = {access: 'private', useCache: false};
const blobOptions = {access: 'private', contentType: 'application/json', addRandomSuffix: false};
const sha256 = value => createHash('sha256').update(value).digest('hex');

function same(left, right) {
  return typeof left === 'string' && typeof right === 'string' && left.length === right.length
    && Buffer.byteLength(left) === Buffer.byteLength(right)
    && timingSafeEqual(Buffer.from(left), Buffer.from(right));
}

function pushSubscription(value) {
  const endpoint = value?.endpoint;
  const {p256dh, auth} = value?.keys ?? {};
  if (typeof endpoint !== 'string' || endpoint.length > 2000) return null;
  const url = URL.parse(endpoint);
  if (!url || url.protocol !== 'https:' || url.port || url.username || url.password || url.hash) return null;
  const host = url.hostname;
  const allowed = ['fcm.googleapis.com', 'updates.push.services.mozilla.com', 'web.push.apple.com'].includes(host)
    || host.endsWith('.push.apple.com') || host.endsWith('.notify.windows.com');
  if (!allowed || typeof p256dh !== 'string' || p256dh.length !== 87 || !base64url.test(p256dh)
    || typeof auth !== 'string' || auth.length !== 22 || !base64url.test(auth)) return null;
  return {endpoint: url.href, keys: {p256dh, auth}};
}

async function read(storage, path) {
  const result = await storage.get(path, noCache);
  if (result?.statusCode !== 200) return null;
  return {data: await new Response(result.stream).json(), etag: result.blob.etag};
}

function write(storage, path, data, etag) {
  return storage.put(path, JSON.stringify(data), {...blobOptions, allowOverwrite: Boolean(etag), ifMatch: etag});
}

async function update(storage, path, change) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const current = await read(storage, path);
    if (!current) return null;
    const next = change(current.data);
    if (next === current.data) return next;
    try {
      await write(storage, path, next, current.etag);
      return next;
    } catch (error) {
      if (!(error instanceof BlobPreconditionFailedError)) throw error;
    }
  }
  throw new Error('Concurrent tester update');
}

export function createHandler({storage = {get, put, list, del}, push = webPush, config, namespace} = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('Vary', 'Authorization');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const fail = (status, error) => res.status(status).json({error});
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return fail(405, 'Gebruik POST.');
    }
    const origin = req.headers.origin;
    if (origin && origin !== `https://${req.headers.host}` && origin !== `http://${req.headers.host}`) {
      return fail(403, 'Ongeldige herkomst.');
    }
    try {
      const settings = config ?? JSON.parse(process.env.REHABOOM_TESTERS_CONFIG || 'null');
      if (!settings?.adminHash || !settings.signingKey || !settings.vapidPublic || !settings.vapidPrivate) {
        return fail(503, 'Het testeroverzicht is nog niet ingesteld.');
      }
      const environment = namespace ?? (req.headers.host === 'rehaboom.vercel.app' && process.env.VERCEL_ENV === 'production' ? 'live' : 'preview');
      const root = `rehaboom-testers-v1/${environment}/`;
      const records = `${root}people/`;
      const recordPath = id => `${records}${id}.json`;
      const makeToken = id => `${id}.${createHmac('sha256', settings.signingKey).update(`${environment}:${id}`).digest('base64url')}`;
      const token = /^Bearer ([\w.-]{20,100})$/.exec(req.headers.authorization || '')?.[1] || '';
      const body = req.body ?? {};
      const {action} = body;
      const data = response => res.status(200).json(response);

      if (['list', 'create', 'remove', 'send'].includes(action)) {
        if (!same(sha256(token), settings.adminHash)) return fail(401, 'Ongeldige beheercode.');
        if (action === 'create') {
          const name = typeof body.name === 'string' ? body.name.trim() : '';
          if (!name || name.length > 60) return fail(400, 'Gebruik een naam of label van maximaal 60 tekens.');
          const {blobs} = await storage.list({prefix: records, limit: 30});
          if (blobs.length >= 30) return fail(409, 'Het maximum van 30 testers is bereikt.');
          const id = randomBytes(16).toString('hex');
          await write(storage, recordPath(id), {id, name, firstVisit: null, lastVisit: null, subscriptions: []});
          return data({token: makeToken(id)});
        }
        if (action === 'remove') {
          if (!idPattern.test(body.id ?? '')) return fail(400, 'Ongeldige tester.');
          await storage.del(recordPath(body.id));
          return data({ok: true});
        }
        const {blobs} = await storage.list({prefix: records, limit: 100});
        const testers = (await Promise.all(blobs.map(blob => read(storage, blob.pathname))))
          .filter(Boolean).map(({data: tester}) => tester);
        if (action === 'list') {
          return data({testers: testers.map(({id, name, firstVisit, lastVisit, subscriptions}) => ({
            id, name, firstVisit, lastVisit, pushDevices: subscriptions.length, token: makeToken(id),
          }))});
        }

        const title = typeof body.title === 'string' ? body.title.trim() : '';
        const message = typeof body.message === 'string' ? body.message.trim() : '';
        if (!title || title.length > 70 || !message || message.length > 200 || !idPattern.test(body.id ?? '')) {
          return fail(400, 'Vul een titel en bericht in binnen de aangegeven lengte.');
        }
        const job = `${root}messages/${body.id}.json`;
        let lock;
        try {
          lock = await write(storage, job, {pending: true});
        } catch (error) {
          const existing = await read(storage, job);
          if (existing?.data.pending) return fail(409, 'Dit bericht wordt verwerkt of de verzending is onderbroken.');
          if (existing) return data(existing.data);
          throw error;
        }
        const devices = new Map();
        for (const tester of testers) {
          for (const subscription of tester.subscriptions) {
            const entry = devices.get(subscription.endpoint) ?? {subscription, ids: []};
            entry.ids.push(tester.id);
            devices.set(subscription.endpoint, entry);
          }
        }
        const recipients = [...devices.values()];
        const counts = {accepted: 0, expired: 0, failed: 0};
        const payload = JSON.stringify({title, body: message});
        const options = {
          TTL: 86400, timeout: 4500, topic: body.id,
          vapidDetails: {subject: 'https://rehaboom.vercel.app/', publicKey: settings.vapidPublic, privateKey: settings.vapidPrivate},
        };
        for (let offset = 0; offset < recipients.length; offset += 10) {
          await Promise.all(recipients.slice(offset, offset + 10).map(async ({subscription, ids}) => {
            try {
              await push.sendNotification(subscription, payload, options);
              counts.accepted++;
            } catch (error) {
              if (error.statusCode !== 404 && error.statusCode !== 410) {
                counts.failed++;
                return;
              }
              counts.expired++;
              await Promise.allSettled(ids.map(id => update(storage, recordPath(id), tester => ({
                ...tester, subscriptions: tester.subscriptions.filter(item => item.endpoint !== subscription.endpoint
                  || item.keys.auth !== subscription.keys.auth || item.keys.p256dh !== subscription.keys.p256dh),
              }))));
            }
          }));
        }
        await write(storage, job, counts, lock.etag);
        return data(counts);
      }

      if (!['status', 'visit', 'subscribe', 'unsubscribe'].includes(action)) return fail(400, 'Onbekende actie.');
      const id = token.split('.')[0];
      if (!idPattern.test(id) || !same(token, makeToken(id))) return fail(401, 'Ongeldige uitnodiging.');
      const path = recordPath(id);
      if (action === 'status') {
        const current = await read(storage, path);
        if (!current) return fail(404, 'Deze uitnodiging is ingetrokken.');
        return data({name: current.data.name, publicKey: settings.vapidPublic});
      }

      const subscription = action === 'subscribe' ? pushSubscription(body.subscription) : null;
      const endpoint = action === 'unsubscribe' && typeof body.endpoint === 'string' ? body.endpoint : '';
      if (action === 'subscribe' && !subscription) return fail(400, 'Deze pushregistratie wordt niet ondersteund.');
      if (action === 'unsubscribe' && !endpoint) return fail(400, 'Geen pushregistratie opgegeven.');
      const current = await update(storage, path, tester => {
        if (action === 'visit') {
          const now = new Date().toISOString();
          return {...tester, firstVisit: tester.firstVisit ?? now, lastVisit: now};
        }
        const next = tester.subscriptions.filter(item => item.endpoint !== (subscription?.endpoint ?? endpoint));
        if (subscription) next.push(subscription);
        return {...tester, subscriptions: next.slice(-2)};
      });
      return current ? data({ok: true}) : fail(404, 'Deze uitnodiging is ingetrokken.');
    } catch {
      return fail(503, 'Tijdelijk niet beschikbaar. Probeer het later opnieuw.');
    }
  };
}

export default createHandler();

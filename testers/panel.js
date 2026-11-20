(() => {
  const tokenKey = 'rehaboom-tester-v1';
  const endpointKey = 'rehaboom-tester-push-v1';
  const tokenPattern = /^[a-f0-9]{32}\.[\w-]{43}$/;
  const isAdmin = new URLSearchParams(location.search).has('beheer');
  const $ = id => document.getElementById(id);
  const date = new Intl.DateTimeFormat('nl-NL', {dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Amsterdam'});
  let adminToken = '';
  let candidate;
  let registration;
  let sendRequest;
  const saved = key => localStorage.getItem(key);

  function feedback(message, target = 'feedback') {
    $(target).textContent = message;
    $(target).hidden = !message;
  }

  async function request(action, token, fields = {}) {
    const response = await fetch('/api/testers', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify({action, ...fields}),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(result.error || 'Verbinding mislukt. Probeer het opnieuw.'), {status: response.status});
    return result;
  }

  function action(element, event, operation) {
    element.addEventListener(event, async e => {
      e.preventDefault();
      const button = event === 'submit' ? element.querySelector('button') : element;
      button.disabled = true;
      feedback('');
      try { await operation(); } catch (error) { feedback(error.message); }
      finally { button.disabled = false; }
    });
  }

  function invitation(token) {
    return new URL(`/testers/#uitnodiging=${token}`, location.origin).href;
  }

  function inviteToken(input) {
    const value = input.trim();
    if (tokenPattern.test(value)) return value;
    let url;
    try { url = new URL(value); } catch { return ''; }
    if (url?.origin === location.origin && /^\/testers\/?$/.test(url.pathname)) {
      return new URLSearchParams(url.hash.slice(1)).get('uitnodiging') || '';
    }
    return '';
  }

  function button(text, operation, className = 'secondary') {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = className;
    element.textContent = text;
    action(element, 'click', operation);
    return element;
  }

  function drawList(testers) {
    const rows = [...testers].sort((a, b) => a.name.localeCompare(b.name, 'nl'));
    $('empty').hidden = Boolean(rows.length);
    $('table-wrap').hidden = !rows.length;
    $('testers').replaceChildren(...rows.map(tester => {
      const row = document.createElement('tr');
      for (const [label, value] of [
        ['', tester.name], ['Eerste bezoek', tester.firstVisit ? date.format(new Date(tester.firstVisit)) : 'Nog geen bezoek'],
        ['Laatste bezoek', tester.lastVisit ? date.format(new Date(tester.lastVisit)) : '—'], ['Pushapparaten', String(tester.pushDevices)],
      ]) {
        const cell = row.insertCell();
        if (label) cell.dataset.label = label;
        cell.textContent = value;
      }
      const actions = row.insertCell();
      actions.className = 'actions';
      actions.append(button('Kopieer link', () => copyInvite(tester.token)), button('Intrekken', async () => {
        if (!confirm(`Link van ${tester.name} intrekken en de bijbehorende gegevens verwijderen?`)) return;
        await request('remove', adminToken, {id: tester.id});
        $('new-invite').hidden = true;
        await refreshList();
        feedback('Uitnodiging ingetrokken.');
      }, 'quiet'));
      return row;
    }));
  }

  async function refreshList() {
    drawList((await request('list', adminToken)).testers);
  }

  async function copyInvite(token) {
    $('new-link').value = invitation(token);
    $('new-invite').hidden = false;
    try {
      await navigator.clipboard.writeText($('new-link').value);
      feedback('Persoonlijke testlink gekopieerd.');
    } catch {
      $('new-link').focus();
      $('new-link').select();
      feedback('De persoonlijke testlink is geselecteerd om te kopiëren.');
    }
  }

  function adminPage() {
    $('title').textContent = 'Testerbeheer';
    $('login').hidden = false;
    action($('login-form'), 'submit', async () => {
      const code = $('admin-code').value.trim();
      drawList((await request('list', code)).testers);
      adminToken = code;
      $('admin-code').value = '';
      $('login').hidden = true;
      $('admin').hidden = false;
      $('name').focus();
    });
    action($('create'), 'submit', async () => {
      const {token} = await request('create', adminToken, {name: $('name').value});
      $('name').value = '';
      await copyInvite(token);
      await refreshList();
    });
    action($('refresh'), 'click', refreshList);
    action($('logout'), 'click', () => location.reload());
    action($('send'), 'submit', async () => {
      const title = $('message-title').value.trim();
      const message = $('message').value.trim();
      if (!title || !message) throw new Error('Vul een titel en bericht in.');
      if (!confirm('Dit updatebericht naar alle aangemelde testapparaten sturen?')) return;
      if (sendRequest?.title !== title || sendRequest?.message !== message) {
        sendRequest = {id: crypto.randomUUID().replaceAll('-', ''), title, message};
      }
      feedback('Verzending wordt verwerkt…', 'send-result');
      try {
        const {accepted, expired, failed} = await request('send', adminToken, sendRequest);
        feedback(accepted + expired + failed
          ? `Door de pushdienst geaccepteerd: ${accepted}. Verlopen: ${expired}. Mislukt: ${failed}.`
          : 'Er zijn nog geen apparaten aangemeld voor pushberichten.', 'send-result');
        sendRequest = undefined;
        $('message').value = '';
      } catch (error) {
        feedback(error.message, 'send-result');
      }
      await refreshList();
    });
  }

  function pushControls(enabled) {
    $('enable').hidden = enabled;
    $('disable').hidden = !enabled;
  }

  async function preparePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      feedback('Pushberichten zijn niet beschikbaar in deze browser.');
      return;
    }
    const worker = await navigator.serviceWorker.register('/sw.js');
    if (worker.installing && !worker.active) await navigator.serviceWorker.ready;
    registration = worker;
    const subscription = await registration.pushManager.getSubscription();
    pushControls(Boolean(subscription && subscription.endpoint === saved(endpointKey) && Notification.permission === 'granted'));
    $('enable').disabled = false;
  }

  async function stopPush(token) {
    const subscription = await registration?.pushManager.getSubscription();
    const endpoint = saved(endpointKey) || subscription?.endpoint;
    if (endpoint) {
      try { await request('unsubscribe', token, {endpoint}); }
      catch (error) { if (![401, 404].includes(error.status)) throw error; }
      localStorage.removeItem(endpointKey);
    }
    await subscription?.unsubscribe().catch(() => {});
    pushControls(false);
  }

  async function showInvitation(token) {
    if (!tokenPattern.test(token)) throw new Error('Deze persoonlijke testlink is ongeldig.');
    candidate = {token, ...await request('status', token)};
    const active = saved(tokenKey) === token;
    $('invite').hidden = true;
    $('invited').hidden = active;
    $('active').hidden = !active;
    $('greeting').textContent = `Welkom, ${candidate.name}.`;
    $('active-name').textContent = `Je test Rehaboom als ${candidate.name}.`;
    if (active) preparePush().catch(() => feedback('Meldingen zijn op dit toestel tijdelijk niet beschikbaar.'));
  }

  async function testerPage() {
    $('tester').hidden = false;
    action($('invite'), 'submit', () => showInvitation(inviteToken($('invite-code').value)));
    action($('start'), 'click', async () => {
      const previous = saved(tokenKey);
      if (previous && previous !== candidate.token) await stopPush(previous);
      localStorage.setItem(tokenKey, candidate.token);
      try { await request('visit', candidate.token); }
      catch (error) { localStorage.removeItem(tokenKey); throw error; }
      $('invite-code').value = '';
      feedback('Je testdeelname is gestart.');
      await showInvitation(candidate.token);
    });
    action($('enable'), 'click', async () => {
      if (!registration) throw new Error('Meldingen worden nog voorbereid. Probeer het opnieuw.');
      if (await Notification.requestPermission() !== 'granted') throw new Error('Meldingen zijn niet toegestaan op dit toestel.');
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const raw = candidate.publicKey.replaceAll('-', '+').replaceAll('_', '/');
        const key = Uint8Array.from(atob(raw.padEnd(Math.ceil(raw.length / 4) * 4, '=')), char => char.charCodeAt(0));
        subscription = await registration.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: key});
      }
      try { await request('subscribe', candidate.token, {subscription: subscription.toJSON()}); }
      catch (error) { await subscription.unsubscribe().catch(() => {}); throw error; }
      localStorage.setItem(endpointKey, subscription.endpoint);
      pushControls(true);
      feedback('Updateberichten staan aan op dit toestel.');
    });
    action($('disable'), 'click', async () => {
      await stopPush(candidate.token);
      feedback('Updateberichten staan uit op dit toestel.');
    });
    action($('leave'), 'click', async () => {
      await stopPush(candidate.token);
      localStorage.removeItem(tokenKey);
      candidate = undefined;
      $('active').hidden = true;
      $('invite').hidden = false;
      feedback('Je testdeelname is op dit toestel gestopt.');
    });
    const incoming = new URLSearchParams(location.hash.slice(1)).get('uitnodiging');
    if (incoming) history.replaceState(null, '', location.pathname + location.search);
    const token = incoming || saved(tokenKey);
    if (token) {
      try { await showInvitation(token); }
      catch (error) {
        if ([401, 404].includes(error.status) && token === saved(tokenKey)) localStorage.removeItem(tokenKey);
        feedback(error.message);
      }
    }
  }

  if (isAdmin) adminPage();
  else testerPage().catch(error => feedback(error.message));
})();

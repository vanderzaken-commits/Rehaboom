self.addEventListener('push', event => {
  let data;
  try { data = event.data?.json(); } catch { data = {}; }
  event.waitUntil(self.registration.showNotification(data?.title || 'Rehaboom-update', {
    body: data?.body || 'Open Rehaboom voor de nieuwste versie.',
    icon: '/icons/icon-192.png',
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const home = new URL('/', self.location.origin).href;
    const windows = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
    const app = windows.find(client => new URL(client.url).pathname === '/');
    if (app) {
      try { await app.navigate(home); } catch { /* Focus the existing app if navigation fails. */ }
      return app.focus();
    }
    return self.clients.openWindow(home);
  })());
});

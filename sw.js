// Interior Dezign Studio OS — small service worker.
// It lets phones, iPads and installed apps show notifications and opens the app when one is tapped.
// It does not cache the app, so every visit loads the newest version.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const data = event.notification.data || {};
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const scope = self.registration.scope;
    let win = all.find(c => c.url.startsWith(scope));
    if (win) { try { await win.focus(); } catch (e) { /* ignore */ } }
    else { win = await self.clients.openWindow(scope); }
    if (win) setTimeout(() => win.postMessage({ type: 'open', data }), win.url ? 300 : 1500);
  })());
});

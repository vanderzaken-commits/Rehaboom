(() => {
  const key = 'rehaboom-tester-v1';
  const recordVisit = () => {
    let token;
    try { token = localStorage.getItem(key); } catch { return; }
    if (!token) return;
    fetch('/api/testers', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify({action: 'visit'}),
      keepalive: true,
    }).then(response => {
      if (response.status === 401 || response.status === 404) {
        if (localStorage.getItem(key) === token) localStorage.removeItem(key);
      }
    }).catch(() => {});
  };

  function recordWhenVisible() {
    if (!document.hidden) recordVisit();
    else document.addEventListener('visibilitychange', function onVisible() {
      if (document.hidden) return;
      document.removeEventListener('visibilitychange', onVisible);
      recordVisit();
    });
  }
  recordWhenVisible();
  window.addEventListener('pageshow', event => { if (event.persisted) recordWhenVisible(); });

  document.addEventListener('click', event => {
    if (!event.target.closest?.('[data-care="share-app"]')) return;
    queueMicrotask(() => {
      const actions = document.querySelector('#app-share-status')?.previousElementSibling;
      if (!actions || actions.querySelector('[data-tester-panel]')) return;
      const link = document.createElement('a');
      link.className = 'care-btn';
      link.href = '/testers/';
      link.dataset.testerPanel = '';
      link.textContent = 'Testers en updates';
      actions.append(link);
    });
  });
})();

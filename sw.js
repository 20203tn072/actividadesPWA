let idleTimer;
const IDLE_TIMEOUT = 5000; 

const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ status: 'idle' });
            });
        });
        resetIdleTimer();
    }, IDLE_TIMEOUT);
};

self.addEventListener('install', event => {
    console.log('SW: Instalando...');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('SW: Activando...');
    resetIdleTimer();
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    resetIdleTimer();
    event.respondWith(fetch(event.request));
});

self.addEventListener('push', event => {
    resetIdleTimer();
});

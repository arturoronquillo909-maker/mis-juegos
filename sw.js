// sw.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

// Escuchar cuando la página recibe un mensaje y nos pide lanzar una notificación
self.addEventListener('message', (event) => {
    if (event.data.type === 'NOTIFY') {
        self.registration.showNotification("Cyber-Link ⚡", {
            body: event.data.text,
            icon: 'https://i.pravatar.cc/100',
            tag: 'chat-notification'
        });
    }
});
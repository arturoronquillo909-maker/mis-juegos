// sw.js - Receptor y Capturador Blindado
// Usamos versiones específicas para evitar redirecciones de red bloqueadas
importScripts('https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js');

const db = new Dexie("CyberDB");
db.version(1).stores({ 
    messages: '++id, from, to, text, time, exp, type' 
});

self.addEventListener('install', (e) => {
    self.skipWaiting();
    console.log("SW: Instalado");
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
    console.log("SW: Activo y capturando");
});

// Captura de mensajes Push desde Supabase (o simulación desde DevTools)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { text: 'Nuevo pulso recibido' };
    
    event.waitUntil((async () => {
        // EL DISPOSITIVO CAPTURA Y GUARDA EN INDEXEDDB (COSTO 0)
        await db.messages.add({
            from: data.from || 'Sistema',
            to: data.to || 'User',
            text: data.text || 'Sin contenido',
            time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
            exp: Date.now() + 1800000,
            type: 'recv'
        });

        // Avisar a la página abierta para que actualice el chat visualmente
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach(client => {
            client.postMessage({ type: 'REFRESH_CHAT' });
        });

        return self.registration.showNotification("Cyber-Link ⚡", {
            body: data.text,
            icon: 'https://i.ibb.co/vzY6mYm/logo-neon.png'
        });
    })());
});
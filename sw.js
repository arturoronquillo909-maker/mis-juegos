// sw.js
importScripts('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
importScripts('https://unpkg.com/dexie@latest/dist/dexie.js');

const db = new Dexie("CyberDB");
db.version(1).stores({ messages: '++id, from, to, text, time, exp' });

// USA TUS CREDENCIALES AQUÍ
const supabase = self.supabase.createClient('https://iitlcnrkgwobzckxwnau.supabase.co', 'TU_KEY_AQUÍ');

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

// Escucha de mensajes
supabase.channel('cyber_v16').on('broadcast', {event:'m'}, async (p) => {
    try {
        await db.messages.add(p.payload);
        
        self.registration.showNotification(`Cyber-Link`, {
            body: p.payload.text,
            icon: 'https://i.pravatar.cc/100',
            tag: 'cyber-msg'
        });

        const allClients = await self.clients.matchAll();
        allClients.forEach(client => client.postMessage({ type: 'REFRESH_CHAT' }));
    } catch (err) {
        console.error("Error en SW:", err);
    }
}).subscribe();
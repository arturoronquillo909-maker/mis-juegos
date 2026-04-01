// sw.js - Service Worker
importScripts('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');

const supabase = self.supabase.createClient('TU_URL', 'TU_KEY');

self.addEventListener('install', () => self.skipWaiting());

// Escuchar mensajes en segundo plano
const channel = supabase.channel('cyber_v15').on('broadcast', {event:'m'}, (p) => {
    // Solo actuamos si el mensaje es para nosotros
    // Nota: El ID de usuario debe guardarse en IndexedDB o pasarse al SW
    if (p.payload.to === self.myId) {
        showNotification(p.payload);
        saveMessageToDB(p.payload);
    }
}).subscribe();

function showNotification(data) {
    self.registration.showNotification(`Cyber-Link: ${data.from}`, {
        body: data.text,
        icon: 'https://i.pravatar.cc/100',
        vibrate: [200, 100, 200],
        tag: 'msg-group'
    });
}

// Escuchar comandos desde las páginas (index.html o chat.html)
self.addEventListener('message', (event) => {
    if (event.data.type === 'SET_ID') {
        self.myId = event.data.id;
    }
});
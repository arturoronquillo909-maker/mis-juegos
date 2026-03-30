// fortunex-core.js - Motor de Red V68 (Ultra-Tráfico)
const Fortunex = {
    client: null,
    channel: null,
    config: {
        stars: parseInt(localStorage.getItem('fortunex_stars')) || 50,
        balance: parseFloat(localStorage.getItem('fortunex_bal')) || 100.00
    },

    init(url, key) {
        this.client = supabase.createClient(url, key);
        this.updateStats();
    },

    // UNIRSE A UNA MESA DE CUALQUIER JUEGO
    joinRoom(gameName, roomId, onMessage) {
        this.channel = this.client.channel(`room:${gameName}:${roomId}`, {
            config: { broadcast: { ack: false, self: true } }
        });

        this.channel
            .on('broadcast', { event: 'm' }, ({ payload }) => onMessage(payload))
            .subscribe();
        
        console.log(`📡 Conectado a ${gameName} - Mesa: ${roomId}`);
    },

    // ENVIAR MOVIMIENTO (Gasta solo unos bytes)
    sendMove(data) {
        if (this.channel) {
            this.channel.send({
                type: 'broadcast',
                event: 'm',
                payload: data
            });
        }
    },

    // GESTIÓN DE DINERO Y ESTRELLAS SIN BASE DE DATOS (Rápido y gratis)
    addStars(amount) {
        this.config.stars += amount;
        this.save();
    },

    spendStars(amount) {
        if(this.config.stars >= amount) {
            this.config.stars -= amount;
            this.save();
            return true;
        }
        return false;
    },

    save() {
        localStorage.setItem('fortunex_stars', this.config.stars);
        localStorage.setItem('fortunex_bal', this.config.balance);
        this.updateStats();
    },

    updateStats() {
        // Actualiza automáticamente cualquier HUD que tenga estos IDs
        if(document.getElementById('h-star')) document.getElementById('h-star').innerText = "⭐ " + this.config.stars;
        if(document.getElementById('h-bal')) document.getElementById('h-bal').innerText = "Q " + this.config.balance.toFixed(2);
    }
};
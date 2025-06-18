// Generador de efectos de sonido para Space Invaders
// Usando Web Audio API para crear sonidos clásicos de arcade

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (e) {
            console.log('Audio no soportado:', e);
        }
    }

    createSounds() {
        // Sonido de disparo del jugador
        this.sounds.shoot = () => this.createBeep(800, 0.1, 'sine');
        
        // Sonido de disparo enemigo
        this.sounds.enemyShoot = () => this.createBeep(400, 0.1, 'sawtooth');
        
        // Sonido de explosión de enemigo
        this.sounds.explosion = () => this.createExplosion();
        
        // Sonido de impacto en barricada
        this.sounds.barrierHit = () => this.createBeep(300, 0.2, 'square');
        
        // Sonido de muerte del jugador
        this.sounds.playerDeath = () => this.createDeathSound();
        
        // Sonido de victoria
        this.sounds.victory = () => this.createVictorySound();
        
        // Sonido de game over
        this.sounds.gameOver = () => this.createGameOverSound();
    }

    createBeep(frequency, duration, type = 'sine') {
        if (!this.audioContext || !this.soundEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    createExplosion() {
        if (!this.audioContext || !this.soundEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    createDeathSound() {
        if (!this.audioContext || !this.soundEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    createVictorySound() {
        if (!this.audioContext || !this.soundEnabled) return;
        
        // Secuencia de notas ascendentes
        const notes = [523, 659, 784, 1047]; // C, E, G, C
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.createBeep(freq, 0.3, 'sine');
            }, index * 200);
        });
    }

    createGameOverSound() {
        if (!this.audioContext || !this.soundEnabled) return;
        
        // Secuencia de notas descendentes
        const notes = [523, 440, 349, 262]; // C, A, F, C
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.createBeep(freq, 0.4, 'square');
            }, index * 300);
        });
    }

    playMusic() {
        if (!this.audioContext || !this.musicEnabled) return;
        
        // Música de fondo simple con loop
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        oscillator.start(this.audioContext.currentTime);
        
        // Cambiar frecuencia cada 2 segundos para crear melodía
        setInterval(() => {
            if (this.musicEnabled) {
                const frequencies = [220, 196, 174, 196];
                const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
                oscillator.frequency.setValueAtTime(randomFreq, this.audioContext.currentTime);
            }
        }, 2000);
        
        this.musicOscillator = oscillator;
    }

    stopMusic() {
        if (this.musicOscillator) {
            this.musicOscillator.stop();
            this.musicOscillator = null;
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopMusic();
        } else {
            this.playMusic();
        }
        return this.musicEnabled;
    }

    // Métodos para reproducir sonidos
    shoot() { this.sounds.shoot(); }
    enemyShoot() { this.sounds.enemyShoot(); }
    explosion() { this.sounds.explosion(); }
    barrierHit() { this.sounds.barrierHit(); }
    playerDeath() { this.sounds.playerDeath(); }
    victory() { this.sounds.victory(); }
    gameOver() { this.sounds.gameOver(); }
}

// Exportar para uso global
window.SoundManager = SoundManager; 
// ===============================
// CONFIGURACIÓN DEL JUEGO
// ===============================
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// ===============================
// CONFIGURACIÓN DE ENEMIGOS
// ===============================
const ENEMY_CONFIG = {
  SPEED: 30,
  DROP_DISTANCE: 2,
  SHOOT_INTERVAL: 3000,
  MAX_BULLETS: 10,
  BULLET_SPEED: 150,
  ROWS: 5,
  COLS: 11,
  START_X: 100,
  START_Y: 80,
  SPACING_X: 60,
  SPACING_Y: 50,
  TYPES: ['enemy1', 'enemy2', 'enemy3'],
  POINTS: { 'enemy1': 10, 'enemy2': 20, 'enemy3': 30 },
  SPEED_INCREASE_THRESHOLD_1: 15,
  SPEED_INCREASE_THRESHOLD_2: 8,
  SPEED_INCREASE_AMOUNT_1: 5,
  SPEED_INCREASE_AMOUNT_2: 3,
  MAX_SPEED: 100
};

// ===============================
// CONFIGURACIÓN DEL JUGADOR
// ===============================
const PLAYER_CONFIG = {
  SPEED: 200,
  LIVES: 3,
  MAX_BULLETS: 3,
  SHOOT_COOLDOWN: 150,
  BULLET_SPEED: 500
};

// ===============================
// CONFIGURACIÓN DE BARRICADAS
// ===============================
const BARRIER_CONFIG = {
  COUNT: 4,
  HEALTH: 4,
  DAMAGE_STATES: [1.0, 0.75, 0.5, 0.25, 0]
};

// ===============================
// CONFIGURACIÓN DE AUDIO
// ===============================
const AUDIO_CONFIG = {
  SHOOT_FREQ: 800,
  EXPLOSION_FREQ: 200,
  ENEMY_SHOOT_FREQ: 400,
  PLAYER_DEATH_FREQ: 150,
  BARRIER_HIT_FREQ: 300,
  MUSIC_FREQ: 440,
  MUSIC_VOLUME: 0.3,
  EFFECTS_VOLUME: 0.5,
  STORAGE_KEYS: {
    MUSIC: 'spaceInvadersMusic',
    SOUND: 'spaceInvadersSound'
  }
};

// ===============================
// CONFIGURACIÓN DE HIGH SCORES
// ===============================
const HIGH_SCORES_CONFIG = {
  STORAGE_KEY: 'spaceInvadersHighScores',
  MAX_SCORES: 10,
  MAX_NAME_LENGTH: 10
};

// ===============================
// EXPORTACIÓN
// ===============================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GAME_WIDTH,
    GAME_HEIGHT,
    ENEMY_CONFIG,
    PLAYER_CONFIG,
    BARRIER_CONFIG,
    AUDIO_CONFIG,
    HIGH_SCORES_CONFIG
  };
} else {
  window.GAME_WIDTH = GAME_WIDTH;
  window.GAME_HEIGHT = GAME_HEIGHT;
  window.ENEMY_CONFIG = ENEMY_CONFIG;
  window.PLAYER_CONFIG = PLAYER_CONFIG;
  window.BARRIER_CONFIG = BARRIER_CONFIG;
  window.AUDIO_CONFIG = AUDIO_CONFIG;
  window.HIGH_SCORES_CONFIG = HIGH_SCORES_CONFIG;
} 
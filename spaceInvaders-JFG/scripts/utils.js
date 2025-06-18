// ===============================
// UTILIDADES Y OPTIMIZACIÓN
// ===============================
// Pool de objetos para reutilización
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.active = [];
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }
  get() {
    let obj;
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.createFn();
    }
    this.active.push(obj);
    return obj;
  }
  release(obj) {
    const index = this.active.indexOf(obj);
    if (index > -1) {
      this.active.splice(index, 1);
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }
  releaseAll() {
    this.active.forEach(obj => {
      this.resetFn(obj);
      this.pool.push(obj);
    });
    this.active = [];
  }
  getActiveCount() {
    return this.active.length;
  }
  getPoolSize() {
    return this.pool.length;
  }
}

// Clamp de valores
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Interpolación lineal
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Distancia entre dos puntos
function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Ángulo entre dos puntos
function angle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

// Número aleatorio en rango
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Número entero aleatorio en rango
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Obtener elemento aleatorio de array
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Mezclar array (Fisher-Yates shuffle)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Formatear tiempo en segundos a MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Guardar objeto en localStorage
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    return false;
  }
}

// Cargar objeto de localStorage
function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return defaultValue;
  }
}

// ===============================
// EXPORTACIÓN
// ===============================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ObjectPool,
    clamp,
    lerp,
    distance,
    angle,
    randomRange,
    randomInt,
    randomElement,
    shuffleArray,
    formatTime,
    saveToStorage,
    loadFromStorage
  };
} else {
  window.ObjectPool = ObjectPool;
  window.clamp = clamp;
  window.lerp = lerp;
  window.distance = distance;
  window.angle = angle;
  window.randomRange = randomRange;
  window.randomInt = randomInt;
  window.randomElement = randomElement;
  window.shuffleArray = shuffleArray;
  window.formatTime = formatTime;
  window.saveToStorage = saveToStorage;
  window.loadFromStorage = loadFromStorage;
} 
# 🚀 Space Invaders Arcade

Un clásico juego de Space Invaders desarrollado con **Phaser 3** y **JavaScript ES6+**, con todas las características de los arcades originales y mejoras modernas.

![Space Invaders Arcade](https://img.shields.io/badge/Phaser-3.55.2-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) ![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 Características del Juego

### ✨ Funcionalidades Principales
- **Jugador con movimiento fluido** y disparo múltiple
- **Enemigos en formación** con movimiento grupal y disparo aleatorio
- **Barricadas degradables** con sistema de salud visual
- **Sistema de puntuación** con high scores persistentes
- **Efectos de sonido y música** de fondo arcade
- **Interfaz completa** con menús navegables
- **Controles responsivos** y configuración de audio

### 🎯 Mecánicas de Juego
- **3 tipos de enemigos** con diferentes puntuaciones (10, 20, 30 pts)
- **Sistema de vidas** (3 vidas iniciales)
- **Disparo múltiple** (hasta 3 proyectiles simultáneos)
- **Velocidad progresiva** de enemigos
- **Colisiones realistas** entre todos los elementos
- **Efectos visuales** de explosiones y daño

### 🎵 Sistema de Audio
- **Música de fondo** arcade con toggle (tecla M)
- **Efectos de sonido** para disparos, explosiones y daño
- **Configuración persistente** en localStorage
- **Indicadores visuales** del estado del audio

### 🏆 Sistema de High Scores
- **Persistencia local** con localStorage
- **Top 10 puntajes** con nombres y fechas
- **Entrada de nombre** para nuevos records
- **Posicionamiento automático** de puntajes
- **Pantalla dedicada** de puntajes altos

## 🚀 Instalación y Ejecución

### Requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- No requiere instalación de software adicional
- Conexión a internet (solo para cargar Phaser desde CDN)

### Pasos de Instalación

1. **Descargar el proyecto**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd spaceInvaders-JFG
   ```

2. **Ejecutar el juego**
   - Abrir `index.html` en tu navegador web
   - O usar un servidor local:
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server
   
   # Con PHP
   php -S localhost:8000
   ```

3. **Acceder al juego**
   - Navegar a `http://localhost:8000` (si usas servidor)
   - O simplemente abrir `index.html` directamente

## 🎮 Controles

### Controles Principales
- **← →** : Mover nave espacial
- **ESPACIO** : Disparar proyectil
- **ENTER** : Confirmar selección en menús
- **ESC** : Volver al menú principal (durante el juego)

### Controles de Audio
- **M** : Alternar música de fondo
- **S** : Alternar efectos de sonido

### Navegación de Menús
- **↑ ↓** : Navegar opciones
- **ENTER** : Seleccionar opción

## 📁 Estructura del Proyecto

```
spaceInvaders-JFG/
├── index.html          # Archivo principal HTML
├── scripts/
│   ├── game.js         # Lógica principal del juego
│   ├── config.js       # Configuración centralizada
│   └── utils.js        # Utilidades y optimización
├── audio/
│   └── sounds.js       # Sistema de audio y efectos
├── images/             # Sprites SVG del juego
│   ├── player.svg      # Nave del jugador
│   ├── enemy1.svg      # Enemigo tipo 1 (rojo)
│   ├── enemy2.svg      # Enemigo tipo 2 (naranja)
│   ├── enemy3.svg      # Enemigo tipo 3 (morado)
│   ├── bullet.svg      # Proyectil del jugador
│   ├── enemyBullet.svg # Proyectil enemigo
│   ├── barrier.svg     # Barricada
│   └── explosion.svg   # Efecto de explosión
└── README.md           # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Phaser 3.55.2** - Motor de juegos 2D
- **JavaScript ES6+** - Lógica del juego
- **HTML5 Canvas** - Renderizado gráfico
- **Web Audio API** - Sistema de sonido
- **localStorage** - Persistencia de datos

### Características Técnicas
- **Arquitectura modular** con clases ES6
- **Sistema de escenas** de Phaser
- **Física Arcade** para colisiones
- **Sprites SVG** escalables
- **Audio sintetizado** con Web Audio API
- **Responsive design** optimizado

## 🎨 Características Visuales

### Estilo Arcade
- **Fuente pixel art** (Press Start 2P)
- **Paleta de colores** retro (cian, blanco, negro)
- **Efectos de parpadeo** y animaciones
- **Sprites vectoriales** escalables
- **Interfaz minimalista** y funcional

### Efectos Visuales
- **Explosiones animadas** con tweening
- **Efectos de daño** en barricadas
- **Animaciones de enemigos** con parpadeo
- **Estrellas de fondo** en menús
- **Indicadores de estado** visuales

## 🔧 Personalización

### Modificar Dificultad
Editar en `game.js`:
```javascript
// Velocidad del jugador
this.playerSpeed = 200;

// Velocidad de enemigos
this.enemySpeed = 50;

// Intervalo de disparo enemigo
this.enemyShootInterval = 2000;

// Vidas iniciales
this.playerLives = 3;
```

### Cambiar Puntuaciones
```javascript
// Puntos por tipo de enemigo
this.enemyPoints = { 
  'enemy1': 10,  // Enemigo rojo
  'enemy2': 20,  // Enemigo naranja
  'enemy3': 30   // Enemigo morado
};
```

### Personalizar Audio
Editar en `audio/sounds.js`:
```javascript
// Frecuencias de efectos
const SHOOT_FREQ = 800;
const EXPLOSION_FREQ = 200;
const ENEMY_SHOOT_FREQ = 400;
```

## 🐛 Solución de Problemas

### Problemas Comunes

1. **El juego no carga**
   - Verificar conexión a internet (para cargar Phaser)
   - Usar un servidor local en lugar de abrir directamente
   - Revisar la consola del navegador para errores

2. **No hay sonido**
   - Verificar que el navegador permita audio
   - Hacer clic en la página para activar audio
   - Verificar configuración de audio del sistema

3. **Controles no responden**
   - Asegurar que la ventana del juego tenga el foco
   - Verificar que no haya otros elementos con foco
   - Revisar configuración de teclado del sistema

4. **Rendimiento lento**
   - Cerrar otras pestañas del navegador
   - Verificar que el hardware soporte WebGL
   - Reducir la resolución del navegador

### Compatibilidad
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ❌ Internet Explorer (no compatible)

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Puedes usar, modificar y distribuir libremente.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

1. Revisa la sección de problemas comunes
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🎯 Roadmap

### Próximas Características
- [ ] Múltiples niveles de dificultad
- [ ] Power-ups y bonus
- [ ] Modo cooperativo local
- [ ] Efectos de partículas avanzados
- [ ] Modo survival infinito
- [ ] Logros y badges
- [ ] Exportar/importar puntajes
- [ ] Temas visuales alternativos

### Mejoras Técnicas
- [ ] Optimización de rendimiento
- [ ] Soporte para dispositivos móviles
- [ ] Integración con APIs de puntajes online
- [ ] Modo offline completo
- [ ] WebAssembly para mejor rendimiento

---

**¡Disfruta jugando Space Invaders Arcade!** 🚀👾

*Desarrollado con ❤️ y nostalgia por los arcades clásicos.* 
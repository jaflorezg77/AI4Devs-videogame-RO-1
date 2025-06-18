# 📝 Registro de Cambios - Space Invaders Arcade

## 🎮 Versión 1.1.0 - Mejoras de Jugabilidad

### ✨ **Mejoras Implementadas**

#### 🚀 **Velocidad de Enemigos Optimizada**
- **Velocidad base reducida**: De 50 a 30 píxeles/segundo
- **Descenso más suave**: De 20 a 15 píxeles por descenso
- **Aceleración gradual**: Sistema de aceleración en dos fases
  - Primera fase: +5 velocidad cuando quedan ≤15 enemigos
  - Segunda fase: +3 velocidad cuando quedan ≤8 enemigos
- **Velocidad máxima**: Reducida de 150 a 100 píxeles/segundo

#### 🎯 **Sistema de Disparo Mejorado**
- **Intervalo de disparo enemigo**: Aumentado de 2s a 3s
- **Probabilidad de disparo**: Reducida al 30% por ciclo
- **Velocidad de proyectiles enemigos**: Reducida de 200 a 150
- **Velocidad de proyectiles del jugador**: Reducida de 400 a 350

#### 🎨 **Efectos Visuales Añadidos**
- **Efecto de disparo del jugador**: Parpadeo sutil al disparar
- **Efecto de disparo enemigo**: Parpadeo del enemigo que dispara
- **Efecto de descenso**: Animación visual cuando los enemigos bajan
- **Márgenes de pantalla**: Aumentados para mejor visibilidad

#### 🔧 **Mejoras Técnicas**
- **Movimiento más suave**: Mejor control de la física
- **Colisiones optimizadas**: Mejor detección de límites
- **Configuración centralizada**: Todos los valores en `config.js`
- **Código más limpio**: Mejor organización y comentarios

### 📊 **Comparación de Valores**

| Parámetro | Antes | Después | Mejora |
|-----------|-------|---------|--------|
| Velocidad enemigos | 50 | 30 | -40% |
| Descenso enemigos | 20px | 15px | -25% |
| Disparo enemigo | 2s | 3s | +50% |
| Proyectiles enemigos | 200px/s | 150px/s | -25% |
| Proyectiles jugador | 400px/s | 350px/s | -12.5% |
| Velocidad máxima | 150 | 100 | -33% |

### 🎮 **Experiencia de Juego**

#### ✅ **Antes (Problemas)**
- Enemigos demasiado rápidos
- Disparos enemigos muy frecuentes
- Dificultad desequilibrada
- Movimiento caótico

#### ✅ **Después (Mejoras)**
- Velocidad controlada y jugable
- Disparos enemigos predecibles
- Dificultad progresiva y equilibrada
- Movimiento suave y fluido

### 🛠️ **Archivos Modificados**

1. **`game.js`**
   - Constructor de GameScene
   - Método `updateEnemyMovement()`
   - Método `enemyShoot()`
   - Método `playerShoot()`
   - Método `destroyEnemy()`

2. **`config.js`**
   - Configuración de enemigos
   - Configuración del jugador
   - Valores de aceleración

3. **`CHANGELOG.md`** (nuevo)
   - Documentación de cambios

### 🎯 **Próximas Mejoras Sugeridas**

- [ ] Sistema de niveles de dificultad
- [ ] Power-ups y bonus
- [ ] Efectos de partículas avanzados
- [ ] Modo survival infinito
- [ ] Logros y badges
- [ ] Soporte para dispositivos móviles

### 📝 **Notas de Desarrollo**

- **Fecha**: Diciembre 2024
- **Motivo**: Optimización de jugabilidad basada en feedback
- **Objetivo**: Hacer el juego más accesible y divertido
- **Resultado**: Mejor equilibrio entre desafío y diversión

---

**¡El juego ahora es mucho más jugable y equilibrado!** 🚀 

### Nueva estructura de archivos (desde v1.2)

```
spaceInvaders-JFG/
├── index.html
├── scripts/
│   ├── game.js
│   ├── config.js
│   └── utils.js
├── audio/
│   └── sounds.js
├── images/
│   ├── ...
└── README.md
``` 
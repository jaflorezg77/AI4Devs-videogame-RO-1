// ===============================
// SPACE INVADERS ARCADE - GAME.JS
// ===============================
// Asegúrate de que config.js y utils.js estén cargados antes de este archivo

// ===============================
// SISTEMA DE HIGH SCORES
// ===============================
class HighScoreManager {
  constructor() {
    this.storageKey = HIGH_SCORES_CONFIG.STORAGE_KEY;
    this.maxScores = HIGH_SCORES_CONFIG.MAX_SCORES;
  }
  getHighScores() {
    const scores = localStorage.getItem(this.storageKey);
    return scores ? JSON.parse(scores) : [];
  }
  saveScore(name, score) {
    const scores = this.getHighScores();
    scores.push({ name, score, date: new Date().toLocaleDateString() });
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, this.maxScores);
    localStorage.setItem(this.storageKey, JSON.stringify(topScores));
    return topScores;
  }
  isHighScore(score) {
    const scores = this.getHighScores();
    return scores.length < this.maxScores || score > scores[scores.length - 1].score;
  }
  getScorePosition(score) {
    const scores = this.getHighScores();
    for (let i = 0; i < scores.length; i++) {
      if (score >= scores[i].score) {
        return i + 1;
      }
    }
    return scores.length + 1;
  }
}
const highScoreManager = new HighScoreManager();

// ===============================
// ELIMINAR INPUT DE NOMBRE SI EXISTE
// ===============================
function removeNameInputBox() {
  document.querySelectorAll('input[type="text"]').forEach(input => input.remove());
}

// ===============================
// ESCENAS DEL JUEGO
// ===============================

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
    this.selectedOption = 0;
    this.menuOptions = ['JUGAR', 'INSTRUCCIONES', 'PUNTAJES ALTOS', 'CRÉDITOS'];
  }
  create() {
    removeNameInputBox();
    this.add.text(GAME_WIDTH/2, 120, 'SPACE INVADERS', {
      fontFamily: 'Press Start 2P',
      fontSize: '32px',
      color: '#0ff'
    }).setOrigin(0.5);
    this.createMenuOptions();
    this.showTopScore();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.createStarfield();
  }
  createMenuOptions() {
    this.menuTexts = [];
    const startY = 250;
    const spacing = 40;
    this.menuOptions.forEach((option, index) => {
      const text = this.add.text(GAME_WIDTH/2, startY + index * spacing, option, {
        fontFamily: 'Press Start 2P',
        fontSize: '16px',
        color: '#fff'
      }).setOrigin(0.5);
      this.menuTexts.push(text);
    });
    this.updateMenuSelection();
  }
  updateMenuSelection() {
    this.menuTexts.forEach((text, index) => {
      if (index === this.selectedOption) {
        text.setColor('#0ff');
        text.setScale(1.1);
      } else {
        text.setColor('#fff');
        text.setScale(1);
      }
    });
  }
  showTopScore() {
    const scores = highScoreManager.getHighScores();
    if (scores.length > 0) {
      const topScore = scores[0];
      this.add.text(GAME_WIDTH/2, 450, `Mejor Puntaje: ${topScore.name} - ${topScore.score}`, {
        fontFamily: 'Press Start 2P',
        fontSize: '12px',
        color: '#0ff'
      }).setOrigin(0.5);
    }
  }
  createStarfield() {
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(0, GAME_HEIGHT),
        1,
        0xffffff
      );
      this.tweens.add({
        targets: star,
        y: GAME_HEIGHT + 10,
        duration: Phaser.Math.Between(3000, 8000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000)
      });
    }
  }
  update() {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
      this.updateMenuSelection();
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
      this.updateMenuSelection();
    }
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.selectOption();
    }
  }
  selectOption() {
    switch (this.selectedOption) {
      case 0: this.scene.start('GameScene'); break;
      case 1: this.scene.start('InstructionsScene'); break;
      case 2: this.scene.start('HighScoresScene'); break;
      case 3: this.scene.start('CreditsScene'); break;
    }
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.player = null;
    this.playerSpeed = PLAYER_CONFIG.SPEED;
    this.playerLives = PLAYER_CONFIG.LIVES;
    this.maxBullets = PLAYER_CONFIG.MAX_BULLETS;
    this.lastShootTime = 0;
    this.shootCooldown = PLAYER_CONFIG.SHOOT_COOLDOWN;
    this.enemies = null;
    this.enemySpeed = ENEMY_CONFIG.SPEED;
    this.enemyDirection = 1;
    this.enemyDropDistance = ENEMY_CONFIG.DROP_DISTANCE;
    this.enemyDropCounter = 0;
    this.enemyShootTimer = 0;
    this.enemyShootInterval = ENEMY_CONFIG.SHOOT_INTERVAL;
    this.enemyBulletGroup = null;
    this.enemyTypes = ENEMY_CONFIG.TYPES;
    this.enemyPoints = ENEMY_CONFIG.POINTS;
    this.barriers = null;
    this.barrierHealth = BARRIER_CONFIG.HEALTH;
    this.barrierDamageStates = BARRIER_CONFIG.DAMAGE_STATES;
    this.score = 0;
    this.scoreText = null;
    this.soundManager = null;
    this.audioControls = null;
    this.musicEnabled = true;
    this.soundEnabled = true;
  }
  preload() {
    this.load.svg('player', 'images/player.svg', { width: 32, height: 32 });
    this.load.svg('enemy1', 'images/enemy1.svg', { width: 32, height: 32 });
    this.load.svg('enemy2', 'images/enemy2.svg', { width: 32, height: 32 });
    this.load.svg('enemy3', 'images/enemy3.svg', { width: 32, height: 32 });
    this.load.svg('bullet', 'images/bullet.svg', { width: 8, height: 16 });
    this.load.svg('enemyBullet', 'images/enemyBullet.svg', { width: 8, height: 16 });
    this.load.svg('barrier', 'images/barrier.svg', { width: 64, height: 32 });
    this.load.svg('explosion', 'images/explosion.svg', { width: 32, height: 32 });
  }
  create() {
    removeNameInputBox();
    this.player = this.physics.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 50, 'player');
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M).on('down', () => { this.toggleMusic(); });
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).on('down', () => { this.toggleSound(); });
    this.playerBulletGroup = this.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, defaultKey: 'bullet', maxSize: this.maxBullets });
    this.enemyBulletGroup = this.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, defaultKey: 'enemyBullet', maxSize: 10 });
    this.createEnemyFormation();
    this.createBarriers();
    this.initAudio();
    this.setupCollisions();
    this.livesText = this.add.text(16, 16, `Vidas: ${this.playerLives}`, { fontFamily: 'Press Start 2P', fontSize: '16px', color: '#0ff' });
    this.scoreText = this.add.text(16, 40, `Puntuación: ${this.score}`, { fontFamily: 'Press Start 2P', fontSize: '16px', color: '#0ff' });
    this.audioControls = this.add.text(GAME_WIDTH - 16, 16, 'M: Música  S: Sonidos', { fontFamily: 'Press Start 2P', fontSize: '10px', color: '#aaa' }).setOrigin(1, 0);
    this.input.keyboard.once('keydown-ESC', () => { this.scene.start('MenuScene'); });
  }
  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
    if (this.spaceKey.isDown && this.time.now > this.lastShootTime + this.shootCooldown) {
      this.playerShoot();
    }
    this.playerBulletGroup.children.entries.forEach(bullet => { if (bullet.active && bullet.y < 0) bullet.destroy(); });
    this.enemyBulletGroup.children.entries.forEach(bullet => { if (bullet.active && bullet.y > GAME_HEIGHT) bullet.destroy(); });
    this.updateEnemyMovement();
    this.updateEnemyShooting();
  }
  playerShoot() {
    if (this.playerBulletGroup.countActive() < this.maxBullets) {
      const bullet = this.playerBulletGroup.get();
      if (bullet) {
        bullet.setPosition(this.player.x, this.player.y - 20);
        bullet.setVelocityY(-PLAYER_CONFIG.BULLET_SPEED);
        bullet.setActive(true);
        bullet.setVisible(true);
        this.lastShootTime = this.time.now;
        this.tweens.add({ targets: this.player, alpha: 0.7, duration: 50, yoyo: true, onComplete: () => { this.player.setAlpha(1); } });
        if (window.soundManager) window.soundManager.shoot();
      }
    }
  }
  damagePlayer() {
    this.playerLives--;
    this.livesText.setText(`Vidas: ${this.playerLives}`);
    this.tweens.add({ targets: this.player, alpha: 0.5, duration: 100, yoyo: true, repeat: 2 });
    if (window.soundManager) window.soundManager.playerDeath();
    if (this.playerLives <= 0) this.gameOver();
  }
  createEnemyFormation() {
    this.enemies = this.physics.add.group();
    for (let row = 0; row < ENEMY_CONFIG.ROWS; row++) {
      for (let col = 0; col < ENEMY_CONFIG.COLS; col++) {
        const enemyType = this.enemyTypes[row % this.enemyTypes.length];
        const enemy = this.enemies.create(
          ENEMY_CONFIG.START_X + col * ENEMY_CONFIG.SPACING_X,
          ENEMY_CONFIG.START_Y + row * ENEMY_CONFIG.SPACING_Y,
          enemyType
        );
        enemy.setData('type', enemyType);
        enemy.setData('points', this.enemyPoints[enemyType]);
        this.tweens.add({ targets: enemy, alpha: 0.8, duration: 1000, yoyo: true, repeat: -1, delay: Math.random() * 1000 });
      }
    }
  }
  updateEnemyMovement() {
    if (!this.enemies || this.enemies.countActive() === 0) return;
    let shouldDrop = false;
    let shouldChangeDirection = false;
    this.enemies.children.entries.forEach(enemy => {
      if (enemy.active) {
        if (enemy.x <= 60 || enemy.x >= GAME_WIDTH - 60) shouldChangeDirection = true;
        if (enemy.y >= GAME_HEIGHT - 120) this.gameOver();
      }
    });
    if (shouldChangeDirection) {
      this.enemyDirection *= -1;
      this.enemyDropCounter = (this.enemyDropCounter || 0) + 1;
      if (this.enemyDropCounter % 8 === 0) {
        shouldDrop = true;
      } else {
        shouldDrop = false;
      }
    }
    this.enemies.children.entries.forEach(enemy => {
      if (enemy.active) {
        enemy.setVelocityX(this.enemySpeed * this.enemyDirection);
        if (shouldDrop) {
          enemy.y += this.enemyDropDistance;
          this.tweens.add({ targets: enemy, alpha: 0.6, duration: 200, yoyo: true, onComplete: () => { enemy.setAlpha(0.8); } });
        }
      }
    });
  }
  updateEnemyShooting() {
    if (this.time.now > this.enemyShootTimer + this.enemyShootInterval) {
      this.enemyShoot();
      this.enemyShootTimer = this.time.now;
    }
  }
  enemyShoot() {
    const activeEnemies = this.enemies.children.entries.filter(enemy => enemy.active);
    if (activeEnemies.length === 0) return;
    const bottomEnemies = this.getBottomEnemies(activeEnemies);
    if (bottomEnemies.length === 0) return;
    const shootChance = 0.3;
    if (Math.random() > shootChance) return;
    const randomEnemy = Phaser.Utils.Array.GetRandom(bottomEnemies);
    if (randomEnemy) {
      const bullet = this.enemyBulletGroup.get();
      if (bullet) {
        bullet.setPosition(randomEnemy.x, randomEnemy.y + 20);
        bullet.setVelocityY(ENEMY_CONFIG.BULLET_SPEED);
        bullet.setActive(true);
        bullet.setVisible(true);
        this.tweens.add({ targets: randomEnemy, alpha: 1, duration: 100, yoyo: true, onComplete: () => { randomEnemy.setAlpha(0.8); } });
        if (window.soundManager) window.soundManager.enemyShoot();
      }
    }
  }
  getBottomEnemies(activeEnemies) {
    const enemiesByColumn = {};
    activeEnemies.forEach(enemy => {
      const col = Math.round(enemy.x / ENEMY_CONFIG.SPACING_X);
      if (!enemiesByColumn[col] || enemy.y > enemiesByColumn[col].y) {
        enemiesByColumn[col] = enemy;
      }
    });
    return Object.values(enemiesByColumn);
  }
  destroyEnemy(enemy) {
    if (window.soundManager) window.soundManager.explosion();
    const explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
    this.tweens.add({ targets: explosion, alpha: 0, duration: 300, onComplete: () => explosion.destroy() });
    enemy.destroy();
    const remainingEnemies = this.enemies.countActive();
    if (remainingEnemies <= 15) this.enemySpeed = Math.min(this.enemySpeed + 5, 80);
    if (remainingEnemies <= 8) this.enemySpeed = Math.min(this.enemySpeed + 3, 100);
    if (remainingEnemies <= 1) this.victory();
  }
  createBarriers() {
    this.barriers = this.physics.add.group();
    const numBarriers = BARRIER_CONFIG.COUNT;
    const startX = 100;
    const barrierY = GAME_HEIGHT - 150;
    const spacing = (GAME_WIDTH - 200) / (numBarriers - 1);
    for (let i = 0; i < numBarriers; i++) {
      const barrier = this.barriers.create(startX + i * spacing, barrierY, 'barrier');
      barrier.setData('health', this.barrierHealth);
      barrier.setData('maxHealth', this.barrierHealth);
      barrier.setData('damageState', 0);
      barrier.setScale(0.8);
      this.tweens.add({ targets: barrier, alpha: 0.9, duration: 2000, yoyo: true, repeat: -1, delay: i * 500 });
    }
  }
  damageBarrier(barrier) {
    const currentHealth = barrier.getData('health');
    const newHealth = Math.max(0, currentHealth - 1);
    barrier.setData('health', newHealth);
    const damageState = this.barrierHealth - newHealth;
    barrier.setData('damageState', damageState);
    const alpha = this.barrierDamageStates[damageState];
    barrier.setAlpha(alpha);
    this.tweens.add({ targets: barrier, alpha: 0.3, duration: 100, yoyo: true, repeat: 2, onComplete: () => { barrier.setAlpha(this.barrierDamageStates[damageState]); } });
    if (window.soundManager) window.soundManager.barrierHit();
    if (newHealth <= 0) this.destroyBarrier(barrier);
  }
  destroyBarrier(barrier) {
    const explosion = this.add.sprite(barrier.x, barrier.y, 'explosion');
    explosion.setScale(0.5);
    this.tweens.add({ targets: explosion, alpha: 0, scale: 1.5, duration: 400, onComplete: () => explosion.destroy() });
    barrier.destroy();
    if (window.soundManager) window.soundManager.explosion();
  }
  setupCollisions() {
    this.physics.add.collider(this.player, this.enemies);
    this.physics.add.collider(this.player, this.enemyBulletGroup);
    this.physics.add.collider(this.playerBulletGroup, this.enemies);
    this.physics.add.collider(this.playerBulletGroup, this.barriers);
    this.physics.add.collider(this.enemyBulletGroup, this.barriers);
    this.setupCollisionCallbacks();
  }
  setupCollisionCallbacks() {
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => { this.damagePlayer(); this.destroyEnemy(enemy); });
    this.physics.add.overlap(this.player, this.enemyBulletGroup, (player, bullet) => { bullet.destroy(); this.damagePlayer(); });
    this.physics.add.overlap(this.playerBulletGroup, this.enemies, (bullet, enemy) => { bullet.destroy(); this.addScore(enemy.getData('points')); this.destroyEnemy(enemy); });
    this.physics.add.overlap(this.playerBulletGroup, this.barriers, (bullet, barrier) => { bullet.destroy(); this.damageBarrier(barrier); });
    this.physics.add.overlap(this.enemyBulletGroup, this.barriers, (bullet, barrier) => { bullet.destroy(); this.damageBarrier(barrier); });
  }
  addScore(points) {
    this.score += points;
    this.scoreText.setText(`Puntuación: ${this.score}`);
    this.tweens.add({ targets: this.scoreText, scale: 1.2, duration: 200, yoyo: true });
  }
  initAudio() {
    // Aquí puedes inicializar tu sistema de audio si lo tienes
  }
  toggleMusic() {}
  toggleSound() {}
  updateAudioDisplay() {}
  gameOver() { this.scene.start('GameOverScene', { score: this.score }); }
  victory() { this.scene.start('VictoryScene', { score: this.score }); }
}

// ===============================
// INICIALIZACIÓN DEL JUEGO
// ===============================
// (Este bloque se mueve al final del archivo)

// ===============================
// ESCENA GAME OVER
// ===============================
class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
    this.playerName = '';
    this.isEnteringName = false;
  }
  create(data) {
    removeNameInputBox();
    const score = data && data.score ? data.score : 0;
    this.add.text(GAME_WIDTH/2, 100, 'GAME OVER', { fontFamily: 'Press Start 2P', fontSize: '32px', color: '#f00' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH/2, 160, `Puntuación: ${score}`, { fontFamily: 'Press Start 2P', fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    if (highScoreManager.isHighScore(score)) {
      this.showHighScoreInput(score);
    } else {
      this.showHighScores(score);
    }
  }
  showHighScoreInput(score) {
    this.add.text(GAME_WIDTH/2, 220, '¡NUEVO PUNTAJE ALTO!', { fontFamily: 'Press Start 2P', fontSize: '14px', color: '#0ff' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH/2, 260, 'Ingresa tu nombre:', { fontFamily: 'Press Start 2P', fontSize: '12px', color: '#fff' }).setOrigin(0.5);
    const inputBox = document.createElement('input');
    inputBox.type = 'text';
    inputBox.maxLength = 10;
    inputBox.style.cssText = `position: absolute; left: ${GAME_WIDTH/2 - 100}px; top: 280px; width: 200px; height: 30px; font-family: 'Press Start 2P', monospace; font-size: 14px; text-align: center; background: #222; color: #fff; border: 2px solid #0ff; border-radius: 5px;`;
    document.body.appendChild(inputBox);
    inputBox.focus();
    this.inputBox = inputBox;
    this.isEnteringName = true;
    inputBox.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.saveHighScore(score, inputBox.value || 'ANÓNIMO');
      }
    });
  }
  saveHighScore(score, name) {
    if (this.inputBox) {
      document.body.removeChild(this.inputBox);
      this.inputBox = null;
    }
    highScoreManager.saveScore(name, score);
    this.showHighScores(score);
  }
  showHighScores(score) {
    const scores = highScoreManager.getHighScores();
    const position = highScoreManager.getScorePosition(score);
    this.add.text(GAME_WIDTH/2, 220, 'PUNTAJES ALTOS', { fontFamily: 'Press Start 2P', fontSize: '16px', color: '#0ff' }).setOrigin(0.5);
    for (let i = 0; i < Math.min(5, scores.length); i++) {
      const scoreData = scores[i];
      const color = scoreData.score === score ? '#0ff' : '#fff';
      const text = `${i + 1}. ${scoreData.name} - ${scoreData.score}`;
      this.add.text(GAME_WIDTH/2, 260 + i * 25, text, { fontFamily: 'Press Start 2P', fontSize: '12px', color: color }).setOrigin(0.5);
    }
    if (position <= 5) {
      this.add.text(GAME_WIDTH/2, 400, `¡Tu puntaje está en posición ${position}!`, { fontFamily: 'Press Start 2P', fontSize: '10px', color: '#0ff' }).setOrigin(0.5);
    }
    this.add.text(GAME_WIDTH/2, 450, 'Presiona ENTER para reiniciar', { fontFamily: 'Press Start 2P', fontSize: '14px', color: '#aaa' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-ENTER', () => { this.scene.start('GameScene'); });
  }
}

// ===============================
// ESCENA VICTORIA
// ===============================
class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
    this.playerName = '';
    this.isEnteringName = false;
  }
  create(data) {
    removeNameInputBox();
    const score = data && data.score ? data.score : 0;
    this.add.text(GAME_WIDTH/2, 100, '¡VICTORIA!', { fontFamily: 'Press Start 2P', fontSize: '32px', color: '#0f0' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH/2, 160, `Puntuación: ${score}`, { fontFamily: 'Press Start 2P', fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    if (highScoreManager.isHighScore(score)) {
      this.showHighScoreInput(score);
    } else {
      this.showHighScores(score);
    }
  }
  showHighScoreInput(score) {
    this.add.text(GAME_WIDTH/2, 220, '¡NUEVO PUNTAJE ALTO!', { fontFamily: 'Press Start 2P', fontSize: '14px', color: '#0ff' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH/2, 260, 'Ingresa tu nombre:', { fontFamily: 'Press Start 2P', fontSize: '12px', color: '#fff' }).setOrigin(0.5);
    const inputBox = document.createElement('input');
    inputBox.type = 'text';
    inputBox.maxLength = 10;
    inputBox.style.cssText = `position: absolute; left: ${GAME_WIDTH/2 - 100}px; top: 280px; width: 200px; height: 30px; font-family: 'Press Start 2P', monospace; font-size: 14px; text-align: center; background: #222; color: #fff; border: 2px solid #0ff; border-radius: 5px;`;
    document.body.appendChild(inputBox);
    inputBox.focus();
    this.inputBox = inputBox;
    this.isEnteringName = true;
    inputBox.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.saveHighScore(score, inputBox.value || 'ANÓNIMO');
      }
    });
  }
  saveHighScore(score, name) {
    if (this.inputBox) {
      document.body.removeChild(this.inputBox);
      this.inputBox = null;
    }
    highScoreManager.saveScore(name, score);
    this.showHighScores(score);
  }
  showHighScores(score) {
    const scores = highScoreManager.getHighScores();
    const position = highScoreManager.getScorePosition(score);
    this.add.text(GAME_WIDTH/2, 220, 'PUNTAJES ALTOS', { fontFamily: 'Press Start 2P', fontSize: '16px', color: '#0ff' }).setOrigin(0.5);
    for (let i = 0; i < Math.min(5, scores.length); i++) {
      const scoreData = scores[i];
      const color = scoreData.score === score ? '#0ff' : '#fff';
      const text = `${i + 1}. ${scoreData.name} - ${scoreData.score}`;
      this.add.text(GAME_WIDTH/2, 260 + i * 25, text, { fontFamily: 'Press Start 2P', fontSize: '12px', color: color }).setOrigin(0.5);
    }
    if (position <= 5) {
      this.add.text(GAME_WIDTH/2, 400, `¡Tu puntaje está en posición ${position}!`, { fontFamily: 'Press Start 2P', fontSize: '10px', color: '#0ff' }).setOrigin(0.5);
    }
    this.add.text(GAME_WIDTH/2, 450, 'Presiona ENTER para reiniciar', { fontFamily: 'Press Start 2P', fontSize: '14px', color: '#aaa' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-ENTER', () => { this.scene.start('GameScene'); });
  }
}

// ===============================
// ESCENA INSTRUCCIONES
// ===============================
class InstructionsScene extends Phaser.Scene {
  constructor() { super({ key: 'InstructionsScene' }); }
  create() {
    removeNameInputBox();
    this.add.text(GAME_WIDTH/2, 80, 'INSTRUCCIONES', { fontFamily: 'Press Start 2P', fontSize: '24px', color: '#0ff' }).setOrigin(0.5);
    const instructions = [
      'CONTROLES:',
      '← → : Mover nave',
      'ESPACIO : Disparar',
      'M : Música ON/OFF',
      'S : Sonidos ON/OFF',
      '',
      'OBJETIVO:',
      'Elimina todos los aliens',
      'Evita sus disparos',
      'Usa las barricadas',
      '',
      'PUNTUACIÓN:',
      'Enemigo rojo: 10 pts',
      'Enemigo naranja: 20 pts',
      'Enemigo morado: 30 pts'
    ];
    instructions.forEach((text, index) => {
      const color = text.includes(':') ? '#0ff' : '#fff';
      const fontSize = text.includes(':') ? '14px' : '12px';
      this.add.text(GAME_WIDTH/2, 140 + index * 25, text, { fontFamily: 'Press Start 2P', fontSize: fontSize, color: color }).setOrigin(0.5);
    });
    this.add.text(GAME_WIDTH/2, 520, 'Presiona ENTER para volver', { fontFamily: 'Press Start 2P', fontSize: '12px', color: '#aaa' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-ENTER', () => { this.scene.start('MenuScene'); });
  }
}

// ===============================
// ESCENA HIGH SCORES
// ===============================
class HighScoresScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HighScoresScene' });
    this.enterKey = null;
    this.events && this.events.on('shutdown', this.shutdown, this);
  }
  create() {
    removeNameInputBox();
    this.add.text(GAME_WIDTH/2, 80, 'PUNTAJES ALTOS', { fontFamily: 'Press Start 2P', fontSize: '24px', color: '#0ff' }).setOrigin(0.5);
    const scores = highScoreManager.getHighScores();
    if (scores.length === 0) {
      this.add.text(GAME_WIDTH/2, 250, 'No hay puntajes aún', { fontFamily: 'Press Start 2P', fontSize: '16px', color: '#aaa' }).setOrigin(0.5);
    } else {
      for (let i = 0; i < Math.min(5, scores.length); i++) {
        const scoreData = scores[i];
        const color = i === 0 ? '#0ff' : '#fff';
        const text = `${i + 1}. ${scoreData.name} - ${scoreData.score}`;
        this.add.text(GAME_WIDTH/2, 140 + i * 25, text, { fontFamily: 'Press Start 2P', fontSize: '12px', color: color }).setOrigin(0.5);
      }
    }
    this.add.text(GAME_WIDTH/2, 520, 'Presiona ENTER para volver', { fontFamily: 'Press Start 2P', fontSize: '12px', color: '#aaa' }).setOrigin(0.5);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.enterKey.on('down', () => { this.scene.start('MenuScene'); });
  }
  shutdown() {
    if (this.enterKey) {
      this.enterKey.off('down');
      this.enterKey = null;
    }
  }
}

// ===============================
// ESCENA CRÉDITOS
// ===============================
class CreditsScene extends Phaser.Scene {
  constructor() { super({ key: 'CreditsScene' }); }
  create() {
    removeNameInputBox();
    this.add.text(GAME_WIDTH/2, 80, 'CRÉDITOS', { fontFamily: 'Press Start 2P', fontSize: '24px', color: '#0ff' }).setOrigin(0.5);
    const credits = [
      'SPACE INVADERS ARCADE', '',
      'Desarrollado con:', 'Phaser 3', 'JavaScript ES6+', 'Web Audio API', '',
      'Inspirado en el clásico', 'Space Invaders (1978)', '', '¡Gracias por jugar!'
    ];
    credits.forEach((text, index) => {
      const color = text.includes('Phaser') || text.includes('Space Invaders') ? '#0ff' : '#fff';
      const fontSize = text.includes('SPACE INVADERS') ? '16px' : '12px';
      this.add.text(GAME_WIDTH/2, 140 + index * 25, text, { fontFamily: 'Press Start 2P', fontSize: fontSize, color: color }).setOrigin(0.5);
    });
    this.add.text(GAME_WIDTH/2, 520, 'Presiona ENTER para volver', { fontFamily: 'Press Start 2P', fontSize: '12px', color: '#aaa' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-ENTER', () => { this.scene.start('MenuScene'); });
  }
}

// ===============================
// INICIALIZACIÓN DEL JUEGO
// ===============================
// (Este bloque se mueve al final del archivo)

// ===============================
// INICIALIZACIÓN DEL JUEGO
// ===============================
const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#111',
  scene: [
    MenuScene,
    GameScene,
    GameOverScene,
    VictoryScene,
    InstructionsScene,
    HighScoresScene,
    CreditsScene
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};
window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
}); 
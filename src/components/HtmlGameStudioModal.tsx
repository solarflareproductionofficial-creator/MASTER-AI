import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
  Copy,
  Check,
  Code,
  Eye,
  Columns,
  Sparkles,
  HelpCircle,
  X,
  Share2,
  Terminal,
  FileCode2,
  Layers
} from 'lucide-react';

interface HtmlGameStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor?: string;
  language?: string;
  onGameTested?: () => void;
  onOpenShareGuide?: () => void;
}

interface GamePreset {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  code: string;
}

const GAME_PRESETS: GamePreset[] = [
  {
    id: 'pong',
    name: 'Neon Pong',
    icon: '🏓',
    category: 'Arcade',
    description: 'Klasik neon ışıklı 2D masa tenisi. Fare veya Ok tuşları ile kontrol edilir.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Neon Pong</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #09090b;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: system-ui, sans-serif;
      overflow: hidden;
    }
    #gameCanvas {
      background: #000;
      border: 2px solid #06b6d4;
      box-shadow: 0 0 25px rgba(6, 182, 212, 0.4);
      border-radius: 12px;
      cursor: crosshair;
    }
    .hud {
      margin-bottom: 12px;
      display: flex;
      gap: 24px;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .hud span { color: #06b6d4; }
    .footer {
      margin-top: 10px;
      font-size: 12px;
      color: #71717a;
    }
  </style>
</head>
<body>
  <div class="hud">
    <div>OYUNCU: <span id="playerScore">0</span></div>
    <div>YAPAY ZEKA: <span id="aiScore">0</span></div>
  </div>
  <canvas id="gameCanvas" width="600" height="400"></canvas>
  <div class="footer">Yukarı/Aşağı gitmek için fareyi hareket ettirin</div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const playerScoreEl = document.getElementById('playerScore');
    const aiScoreEl = document.getElementById('aiScore');

    let playerScore = 0;
    let aiScore = 0;

    const paddleWidth = 12;
    const paddleHeight = 70;
    let playerY = (canvas.height - paddleHeight) / 2;
    let aiY = (canvas.height - paddleHeight) / 2;

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballRadius = 7;
    let ballSpeedX = 5;
    let ballSpeedY = 3;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseY = e.clientY - rect.top - root.scrollTop;
      playerY = mouseY - paddleHeight / 2;
    });

    function resetBall() {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = -ballSpeedX;
      ballSpeedY = (Math.random() * 4 - 2);
    }

    function update() {
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Ball ceiling & floor collision
      if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
      }

      // AI simple tracking
      const aiCenter = aiY + paddleHeight / 2;
      if (aiCenter < ballY - 15) {
        aiY += 3.8;
      } else if (aiCenter > ballY + 15) {
        aiY -= 3.8;
      }

      // Keep paddles inside
      playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
      aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));

      // Player collision
      if (ballX - ballRadius < 20 + paddleWidth && ballX + ballRadius > 20) {
        if (ballY > playerY && ballY < playerY + paddleHeight) {
          ballSpeedX = -ballSpeedX * 1.05;
          const deltaY = ballY - (playerY + paddleHeight / 2);
          ballSpeedY = deltaY * 0.22;
        }
      }

      // AI collision
      if (ballX + ballRadius > canvas.width - 20 - paddleWidth && ballX - ballRadius < canvas.width - 20) {
        if (ballY > aiY && ballY < aiY + paddleHeight) {
          ballSpeedX = -ballSpeedX * 1.05;
          const deltaY = ballY - (aiY + paddleHeight / 2);
          ballSpeedY = deltaY * 0.22;
        }
      }

      // Score
      if (ballX < 0) {
        aiScore++;
        aiScoreEl.textContent = aiScore;
        resetBall();
      } else if (ballX > canvas.width) {
        playerScore++;
        playerScoreEl.textContent = playerScore;
        resetBall();
      }
    }

    function draw() {
      // Background clear
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center dotted line
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Player Paddle (Neon Cyan)
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.fillRect(20, playerY, paddleWidth, paddleHeight);

      // AI Paddle (Neon Rose)
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.fillRect(canvas.width - 20 - paddleWidth, aiY, paddleWidth, paddleHeight);

      // Glowing Ball
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    loop();
  </script>
</body>
</html>`
  },
  {
    id: 'snake',
    name: 'Cyber Snake',
    icon: '🐍',
    category: 'Retro',
    description: 'Yön tuşları veya WASD ile yılanı yönlendir, parlayan enerji çekirdeklerini topla!',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cyber Snake</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #09090b;
      color: #f4f4f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: monospace;
      overflow: hidden;
    }
    #gameCanvas {
      background: #111116;
      border: 2px solid #10b981;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.35);
    }
    .hud {
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
    }
    .score { color: #10b981; }
    .instructions {
      margin-top: 8px;
      font-size: 12px;
      color: #a1a1aa;
    }
  </style>
</head>
<body>
  <div class="hud">SKOR: <span id="score" class="score">0</span> | EN YÜKSEK: <span id="highScore" class="score">0</span></div>
  <canvas id="gameCanvas" width="400" height="400"></canvas>
  <div class="instructions">Ok Tuşları veya WASD ile Oyna • Yeniden Başlatmak İçin 'R' veya Space</div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const highScoreEl = document.getElementById('highScore');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let velocityX = 1;
    let velocityY = 0;
    let food = { x: 15, y: 15 };
    let score = 0;
    let highScore = 0;
    let gameOver = false;

    function placeFood() {
      food.x = Math.floor(Math.random() * tileCount);
      food.y = Math.floor(Math.random() * tileCount);
    }

    function resetGame() {
      snake = [{ x: 10, y: 10 }];
      velocityX = 1;
      velocityY = 0;
      score = 0;
      scoreEl.textContent = score;
      gameOver = false;
      placeFood();
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (velocityY === 0) { velocityX = 0; velocityY = -1; }
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        if (velocityY === 0) { velocityX = 0; velocityY = 1; }
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (velocityX === 0) { velocityX = -1; velocityY = 0; }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (velocityX === 0) { velocityX = 1; velocityY = 0; }
      } else if (e.key === ' ' || e.key === 'r' || e.key === 'R') {
        if (gameOver) resetGame();
      }
    });

    function gameTick() {
      if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = '22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('OYUN BİTTİ!', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#f4f4f5';
        ctx.font = '13px monospace';
        ctx.fillText("Yeniden Başlamak İçin 'R' veya Boşluk'a Bas", canvas.width / 2, canvas.height / 2 + 20);
        return;
      }

      // Move head
      const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };

      // Wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
      }

      // Self collision
      for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
          gameOver = true;
        }
      }

      snake.unshift(head);

      // Check food
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        if (score > highScore) {
          highScore = score;
          highScoreEl.textContent = highScore;
        }
        placeFood();
      } else {
        snake.pop();
      }

      // Draw
      ctx.fillStyle = '#09090e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid subtle lines
      ctx.strokeStyle = '#18181b';
      for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw Snake
      snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#34d399' : '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = index === 0 ? 10 : 4;
        ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
      });
      ctx.shadowBlur = 0;
    }

    setInterval(gameTick, 110);
  </script>
</body>
</html>`
  },
  {
    id: 'space-defender',
    name: 'Space Defender',
    icon: '🚀',
    category: 'Action',
    description: 'Uzay gemisini yönet, asteroidleri lazerle yok et ve yüksek puan topla!',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Space Defender</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #020205;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: system-ui, sans-serif;
      overflow: hidden;
    }
    #gameCanvas {
      background: #050510;
      border: 2px solid #8b5cf6;
      border-radius: 12px;
      box-shadow: 0 0 25px rgba(139, 92, 246, 0.4);
      cursor: crosshair;
    }
    .hud {
      margin-bottom: 10px;
      font-size: 15px;
      font-weight: bold;
      display: flex;
      gap: 20px;
    }
    .hud span { color: #a78bfa; }
    .footer { margin-top: 8px; font-size: 12px; color: #71717a; }
  </style>
</head>
<body>
  <div class="hud">
    <div>SKOR: <span id="score">0</span></div>
    <div>CAN: <span id="lives">❤️❤️❤️</span></div>
  </div>
  <canvas id="gameCanvas" width="480" height="520"></canvas>
  <div class="footer">A/D veya Sol/Sağ ile hareket et • Boşluk veya Tıklama ile Ateş Et</div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');

    let score = 0;
    let lives = 3;
    let gameOver = false;

    const ship = {
      x: canvas.width / 2 - 16,
      y: canvas.height - 60,
      width: 32,
      height: 32,
      speed: 6
    };

    let keys = {};
    let bullets = [];
    let enemies = [];
    let particles = [];
    let stars = [];

    // Init stars
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 1.5 + 0.5
      });
    }

    window.addEventListener('keydown', (e) => {
      keys[e.key] = true;
      if (e.key === ' ' && !gameOver) {
        bullets.push({ x: ship.x + ship.width / 2, y: ship.y, speed: 8 });
      }
      if (e.key === 'r' && gameOver) reset();
    });

    window.addEventListener('keyup', (e) => { keys[e.key] = false; });
    canvas.addEventListener('click', () => {
      if (!gameOver) bullets.push({ x: ship.x + ship.width / 2, y: ship.y, speed: 8 });
    });

    function reset() {
      score = 0;
      lives = 3;
      bullets = [];
      enemies = [];
      particles = [];
      gameOver = false;
      scoreEl.textContent = '0';
      livesEl.textContent = '❤️❤️❤️';
    }

    function createExplosion(x, y, color) {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          radius: Math.random() * 3 + 1,
          color,
          life: 1
        });
      }
    }

    function update() {
      if (gameOver) return;

      // Move player
      if ((keys['ArrowLeft'] || keys['a']) && ship.x > 0) ship.x -= ship.speed;
      if ((keys['ArrowRight'] || keys['d']) && ship.x < canvas.width - ship.width) ship.x += ship.speed;

      // Update bullets
      bullets.forEach((b, idx) => {
        b.y -= b.speed;
        if (b.y < 0) bullets.splice(idx, 1);
      });

      // Spawn enemy
      if (Math.random() < 0.03) {
        enemies.push({
          x: Math.random() * (canvas.width - 30),
          y: -30,
          size: Math.random() * 16 + 18,
          speed: Math.random() * 2 + 1.5
        });
      }

      // Update enemies
      enemies.forEach((en, eIdx) => {
        en.y += en.speed;

        // Check bullet hit
        bullets.forEach((b, bIdx) => {
          const dist = Math.hypot(b.x - (en.x + en.size / 2), b.y - (en.y + en.size / 2));
          if (dist < en.size) {
            createExplosion(en.x + en.size / 2, en.y + en.size / 2, '#a78bfa');
            enemies.splice(eIdx, 1);
            bullets.splice(bIdx, 1);
            score += 20;
            scoreEl.textContent = score;
          }
        });

        // Hit player
        if (en.y + en.size > ship.y && en.x < ship.x + ship.width && en.x + en.size > ship.x) {
          createExplosion(ship.x + ship.width / 2, ship.y + ship.height / 2, '#ef4444');
          enemies.splice(eIdx, 1);
          lives--;
          livesEl.textContent = '❤️'.repeat(Math.max(0, lives));
          if (lives <= 0) gameOver = true;
        }

        // Passed bottom
        if (en.y > canvas.height) enemies.splice(eIdx, 1);
      });

      // Update particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
        if (p.life <= 0) particles.splice(idx, 1);
      });

      // Stars
      stars.forEach(st => {
        st.y += st.speed;
        if (st.y > canvas.height) st.y = 0;
      });
    }

    function draw() {
      ctx.fillStyle = '#02020a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = '#ffffff';
      stars.forEach(st => {
        ctx.fillRect(st.x, st.y, st.size, st.size);
      });

      // Draw player ship
      ctx.fillStyle = '#8b5cf6';
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(ship.x + ship.width / 2, ship.y);
      ctx.lineTo(ship.x + ship.width, ship.y + ship.height);
      ctx.lineTo(ship.x + ship.width / 2, ship.y + ship.height - 8);
      ctx.lineTo(ship.x, ship.y + ship.height);
      ctx.closePath();
      ctx.fill();

      // Bullets
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      bullets.forEach(b => {
        ctx.fillRect(b.x - 2, b.y, 4, 12);
      });

      // Enemies
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 10;
      enemies.forEach(en => {
        ctx.beginPath();
        ctx.arc(en.x + en.size / 2, en.y + en.size / 2, en.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Particles
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GÖREV BAŞARISIZ!', canvas.width / 2, canvas.height / 2 - 15);
        ctx.fillStyle = '#e4e4e7';
        ctx.font = '14px sans-serif';
        ctx.fillText('Yeniden başlamak için R tuşuna bas', canvas.width / 2, canvas.height / 2 + 20);
      }
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }
    gameLoop();
  </script>
</body>
</html>`
  },
  {
    id: 'flappy',
    name: 'Flappy Drone',
    icon: '🛸',
    category: 'Casual',
    description: 'Boşluk veya tıklama ile uç, engellerin arasından geç!',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Flappy Drone</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #09090b;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: system-ui, sans-serif;
    }
    #gameCanvas {
      background: #0c0a09;
      border: 2px solid #f59e0b;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.35);
      cursor: pointer;
    }
    .hud { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #f59e0b; }
  </style>
</head>
<body>
  <div class="hud">SKOR: <span id="score">0</span></div>
  <canvas id="gameCanvas" width="380" height="480"></canvas>
  <p style="font-size:12px; color:#a1a1aa; margin-top:8px;">Zıplamak için Tıkla veya Boşluk'a Bas</p>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');

    let drone = { x: 60, y: 200, radius: 12, velocity: 0, gravity: 0.38, jump: -6.5 };
    let pipes = [];
    let score = 0;
    let gameOver = false;
    let frame = 0;

    function reset() {
      drone.y = 200;
      drone.velocity = 0;
      pipes = [];
      score = 0;
      scoreEl.textContent = '0';
      gameOver = false;
      frame = 0;
    }

    function flap() {
      if (gameOver) { reset(); return; }
      drone.velocity = drone.jump;
    }

    window.addEventListener('keydown', (e) => { if (e.key === ' ') flap(); });
    canvas.addEventListener('click', flap);

    function update() {
      if (gameOver) return;
      frame++;
      drone.velocity += drone.gravity;
      drone.y += drone.velocity;

      if (drone.y + drone.radius > canvas.height || drone.y - drone.radius < 0) {
        gameOver = true;
      }

      if (frame % 85 === 0) {
        const gap = 110;
        const top = Math.random() * (canvas.height - gap - 100) + 40;
        pipes.push({ x: canvas.width, top, bottom: canvas.height - top - gap, passed: false });
      }

      pipes.forEach((p, idx) => {
        p.x -= 2.6;

        // Collision check
        if (drone.x + drone.radius > p.x && drone.x - drone.radius < p.x + 40) {
          if (drone.y - drone.radius < p.top || drone.y + drone.radius > canvas.height - p.bottom) {
            gameOver = true;
          }
        }

        if (!p.passed && p.x + 40 < drone.x) {
          p.passed = true;
          score++;
          scoreEl.textContent = score;
        }

        if (p.x < -40) pipes.splice(idx, 1);
      });
    }

    function draw() {
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Pipes
      ctx.fillStyle = '#f59e0b';
      pipes.forEach(p => {
        ctx.fillRect(p.x, 0, 40, p.top);
        ctx.fillRect(p.x, canvas.height - p.bottom, 40, p.bottom);
      });

      // Draw Drone
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(drone.x, drone.y, drone.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f59e0b';
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ÇARPTIN!', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#fff';
        ctx.font = '13px sans-serif';
        ctx.fillText('Tekrar oynamak için tıkla', canvas.width / 2, canvas.height / 2 + 18);
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`
  },
  {
    id: 'starter',
    name: 'Boş Tuval Şablonu',
    icon: '✨',
    category: 'Starter',
    description: 'Sıfırdan kendi HTML5 oyununu geliştirmek için temiz şablon.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My HTML5 Game</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #09090b;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: system-ui, sans-serif;
    }
    #gameCanvas {
      background: #18181b;
      border: 2px solid #06b6d4;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h2 style="margin-bottom: 12px; color: #06b6d4;">Kendi Oyununu Yarat</h2>
  <canvas id="gameCanvas" width="480" height="360"></canvas>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let dx = 3;
    let dy = 2;
    let radius = 20;

    function loop() {
      ctx.fillStyle = 'rgba(24, 24, 27, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      x += dx;
      y += dy;

      if (x + radius > canvas.width || x - radius < 0) dx = -dx;
      if (y + radius > canvas.height || y - radius < 0) dy = -dy;

      requestAnimationFrame(loop);
    }

    loop();
  </script>
</body>
</html>`
  }
];

export const HtmlGameStudioModal: React.FC<HtmlGameStudioModalProps> = ({
  isOpen,
  onClose,
  accentColor = '#06b6d4',
  language = 'tr',
  onGameTested,
  onOpenShareGuide,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('pong');
  const [code, setCode] = useState<string>(GAME_PRESETS[0].code);
  const [activeTab, setActiveTab] = useState<'split' | 'code' | 'preview'>('split');
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const preset = GAME_PRESETS.find((p) => p.id === selectedPresetId);
    if (preset) {
      setCode(preset.code);
    }
  }, [selectedPresetId]);

  // Run or reload game
  const handleRunGame = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = code;
    }
    if (onGameTested) {
      onGameTested();
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Delay slightly to ensure iframe is mounted
      const timer = setTimeout(() => {
        handleRunGame();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, selectedPresetId]);

  if (!isOpen) return null;

  const isTurkish = language === 'tr';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadIndexHtml = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div
        className={`bg-zinc-950 border border-white/10 rounded-2xl w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-6xl h-[92vh]'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
            >
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <span>{isTurkish ? 'HTML5 Oyun Stüdyosu' : 'HTML5 Game Studio'}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    CANLI / LIVE
                  </span>
                </h3>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                {isTurkish
                  ? 'HTML & JavaScript oyunları yaz, canlı test et ve Game Jolt için indir!'
                  : 'Code & preview interactive HTML5 games, then export for Game Jolt!'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Run Game Button */}
            <button
              onClick={handleRunGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-zinc-950 shadow-md cursor-pointer transition-all active:scale-95"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 15px ${accentColor}40`,
              }}
              title={isTurkish ? 'Oyunu Çalıştır / Yenile' : 'Run / Refresh Game'}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isTurkish ? 'Oyunu Çalıştır' : 'Run Game'}</span>
            </button>

            {/* Download index.html for Game Jolt */}
            <button
              onClick={handleDownloadIndexHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-white/10 transition-colors cursor-pointer"
              title={isTurkish ? 'Game Jolt için index.html İndir' : 'Download index.html for Game Jolt'}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{isTurkish ? 'İndi!' : 'Downloaded!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">{isTurkish ? 'Game Jolt İçin İndir' : 'Export Game Jolt'}</span>
                </>
              )}
            </button>

            {/* Game Jolt Guide trigger */}
            {onOpenShareGuide && (
              <button
                onClick={onOpenShareGuide}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-colors cursor-pointer"
                title={isTurkish ? 'Game Jolt Rehberi & Paylaş' : 'Game Jolt Guide & Share'}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{isTurkish ? 'Game Jolt Rehberi' : 'Game Jolt Guide'}</span>
              </button>
            )}

            {/* Copy Code */}
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title={isTurkish ? 'Kodu Kopyala' : 'Copy Code'}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer hidden sm:block"
              title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Selector & View Switcher Strip */}
        <div className="px-4 sm:px-6 py-2.5 bg-zinc-900/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase mr-1">
              {isTurkish ? 'Hazır Oyunlar:' : 'Presets:'}
            </span>
            {GAME_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-zinc-800 text-white border border-white/20 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                  style={{
                    borderColor: isSelected ? accentColor : undefined,
                    color: isSelected ? '#ffffff' : undefined,
                  }}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>

          {/* View Toggles (Split, Code Only, Preview Only) */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('split')}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'split' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="İkiye Bölünmüş Görünüm"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isTurkish ? 'Bölünmüş' : 'Split'}</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Sadece Kod Editörü"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{isTurkish ? 'Kod' : 'Code'}</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Sadece Oyun Ekranı"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isTurkish ? 'Önizleme' : 'Preview'}</span>
            </button>
          </div>
        </div>

        {/* Main Work Area: Code Editor & Game Iframe */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* Code Editor Panel */}
          {(activeTab === 'split' || activeTab === 'code') && (
            <div
              className={`flex flex-col bg-zinc-950 border-r border-white/10 ${
                activeTab === 'code' ? 'w-full' : 'w-full md:w-1/2'
              }`}
            >
              <div className="px-4 py-2 border-b border-white/5 bg-zinc-900/30 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                  index.html (HTML5 Canvas & JS)
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {code.split('\n').length} {isTurkish ? 'satır' : 'lines'}
                </span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 p-4 bg-zinc-950 text-zinc-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-cyan-500/30 scrollbar-thin overflow-y-auto"
                style={{ tabSize: 2 }}
                placeholder="Write your HTML5 game code here..."
              />
            </div>
          )}

          {/* Game Preview Screen */}
          {(activeTab === 'split' || activeTab === 'preview') && (
            <div
              className={`flex flex-col bg-black relative ${
                activeTab === 'preview' ? 'w-full' : 'w-full md:w-1/2'
              }`}
            >
              <div className="px-4 py-2 border-b border-white/10 bg-zinc-900/50 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-zinc-300">
                    {isTurkish ? 'Canlı Oyun Tuvali' : 'Live Game Canvas'}
                  </span>
                </div>
                <button
                  onClick={handleRunGame}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isTurkish ? 'Yeniden Başlat' : 'Restart'}</span>
                </button>
              </div>

              {/* Sandbox IFrame */}
              <div className="flex-1 w-full h-full relative bg-zinc-950 flex items-center justify-center overflow-hidden">
                <iframe
                  ref={iframeRef}
                  title="HTML5 Game Sandbox"
                  sandbox="allow-scripts allow-modals allow-same-origin"
                  className="w-full h-full border-0 bg-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Info & Game Jolt Tip */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-white/10 bg-zinc-900/70 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {isTurkish
                ? 'Game Jolt için "Game Jolt İçin İndir" ile inen index.html dosyasını bir .ZIP dosyasına sıkıştırıp Game Jolt Dashboard > Add Game > Web (HTML) bölümüne yükleyebilirsiniz!'
                : 'To publish on Game Jolt, compress the downloaded index.html into a .zip file and upload to Game Jolt > Add Game > Web (HTML)!'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenShareGuide && (
              <button
                onClick={onOpenShareGuide}
                className="text-[11px] text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
              >
                {isTurkish ? 'Ayrıntılı Game Jolt & Paylaşım Rehberini Aç ➔' : 'Open Game Jolt Guide ➔'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

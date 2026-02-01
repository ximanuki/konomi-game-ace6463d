/**
 * このみちゃんゲーム - パーティクルエフェクト
 * クリア時などのビジュアルエフェクト
 */

/**
 * 紙吹雪エフェクト
 * @param {HTMLElement} container - 親要素（デフォルト: document.body）
 * @param {number} count - 紙吹雪の数
 */
function createConfetti(container = document.body, count = 50) {
  const colors = ['#FF9EC8', '#A8D8FF', '#FFF4A8', '#B8F0B8', '#FFA8D8'];
  
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-particle';
    confetti.style.cssText = `
      position: fixed;
      width: ${randomInt(8, 15)}px;
      height: ${randomInt(8, 15)}px;
      background: ${colors[randomInt(0, colors.length - 1)]};
      left: ${Math.random() * 100}%;
      top: -20px;
      animation: confetti ${2 + Math.random() * 2}s ease-out forwards;
      animation-delay: ${Math.random() * 0.5}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      z-index: 9999;
      pointer-events: none;
    `;
    container.appendChild(confetti);
    
    // アニメーション終了後に削除
    setTimeout(() => confetti.remove(), 4500);
  }
}

/**
 * 星エフェクト
 * @param {HTMLElement} container - 親要素
 * @param {number} count - 星の数
 */
function createStars(container = document.body, count = 30) {
  const starEmojis = ['⭐', '✨', '🌟', '💫'];
  
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.textContent = starEmojis[randomInt(0, starEmojis.length - 1)];
    star.style.cssText = `
      position: fixed;
      font-size: ${16 + Math.random() * 24}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: sparkle ${1 + Math.random()}s ease-in-out infinite;
      animation-delay: ${Math.random() * 1}s;
      pointer-events: none;
      z-index: 9999;
    `;
    container.appendChild(star);
    
    setTimeout(() => star.remove(), 3000);
  }
}

/**
 * ハートエフェクト
 * @param {HTMLElement} container - 親要素
 * @param {number} count - ハートの数
 */
function createHearts(container = document.body, count = 20) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.textContent = '❤️';
    heart.style.cssText = `
      position: fixed;
      font-size: ${20 + Math.random() * 20}px;
      left: ${Math.random() * 100}%;
      bottom: -30px;
      animation: floatUp ${2 + Math.random() * 2}s ease-out forwards;
      animation-delay: ${Math.random() * 0.5}s;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.8;
    `;
    container.appendChild(heart);
    
    setTimeout(() => heart.remove(), 4000);
  }
}

/**
 * 虹エフェクト
 * @param {HTMLElement} container - 親要素
 */
function createRainbow(container = document.body) {
  const rainbow = document.createElement('div');
  rainbow.className = 'rainbow-particle';
  rainbow.textContent = '🌈';
  rainbow.style.cssText = `
    position: fixed;
    font-size: 120px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: rainbowAppear 1.5s ease-out forwards;
    pointer-events: none;
    z-index: 9999;
  `;
  container.appendChild(rainbow);
  
  setTimeout(() => rainbow.remove(), 2000);
}

/**
 * キラキラエフェクト（位置指定）
 * @param {number} x - X座標
 * @param {number} y - Y座標
 * @param {HTMLElement} container - 親要素
 */
function createSparkle(x, y, container = document.body) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle-particle';
  sparkle.textContent = '✨';
  sparkle.style.cssText = `
    position: fixed;
    font-size: 24px;
    left: ${x}px;
    top: ${y}px;
    animation: sparkleOut 0.6s ease-out forwards;
    pointer-events: none;
    z-index: 9998;
  `;
  container.appendChild(sparkle);
  
  setTimeout(() => sparkle.remove(), 700);
}

/**
 * バーストエフェクト（円形に広がる）
 * @param {number} x - 中心X座標
 * @param {number} y - 中心Y座標
 * @param {string} color - 色
 * @param {number} count - パーティクル数
 */
function createBurst(x, y, color = '#FF9EC8', count = 12) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const distance = 50 + Math.random() * 50;
    
    const particle = document.createElement('div');
    particle.className = 'burst-particle';
    particle.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: ${color};
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      animation: burst 0.6s ease-out forwards;
      pointer-events: none;
      z-index: 9998;
      --burst-x: ${Math.cos(angle) * distance}px;
      --burst-y: ${Math.sin(angle) * distance}px;
    `;
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 700);
  }
}

/**
 * テキストポップアップ
 * @param {string} text - 表示テキスト
 * @param {number} x - X座標
 * @param {number} y - Y座標
 * @param {string} color - 色
 */
function createTextPop(text, x, y, color = '#FF9EC8') {
  const popup = document.createElement('div');
  popup.className = 'text-popup';
  popup.textContent = text;
  popup.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: 24px;
    font-weight: bold;
    color: ${color};
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    animation: textPop 0.8s ease-out forwards;
    pointer-events: none;
    z-index: 9998;
  `;
  document.body.appendChild(popup);
  
  setTimeout(() => popup.remove(), 900);
}

/**
 * 追加のCSSアニメーション（動的注入）
 */
function injectParticleAnimations() {
  if (document.getElementById('particle-animations')) return; // 既に注入済み
  
  const style = document.createElement('style');
  style.id = 'particle-animations';
  style.textContent = `
    @keyframes floatUp {
      0% {
        transform: translateY(0) scale(0.5);
        opacity: 0;
      }
      20% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) scale(1);
        opacity: 0;
      }
    }
    
    @keyframes rainbowAppear {
      0% {
        transform: translate(-50%, -50%) scale(0) rotate(-45deg);
        opacity: 0;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.2) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) scale(1) rotate(5deg);
        opacity: 0.8;
      }
    }
    
    @keyframes sparkleOut {
      0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: scale(2) rotate(180deg);
        opacity: 0;
      }
    }
    
    @keyframes burst {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      100% {
        transform: translate(var(--burst-x), var(--burst-y)) scale(0);
        opacity: 0;
      }
    }
    
    @keyframes textPop {
      0% {
        transform: translateY(0) scale(0.5);
        opacity: 0;
      }
      20% {
        transform: translateY(-20px) scale(1.2);
        opacity: 1;
      }
      100% {
        transform: translateY(-60px) scale(1);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ページ読み込み時にアニメーションを注入
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectParticleAnimations);
} else {
  injectParticleAnimations();
}

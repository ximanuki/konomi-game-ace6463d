# 🔧 このみちゃんゲームアプリ - 技術設計書

**バージョン:** 2.0  
**作成日:** 2026-02-01  
**ターゲット:** iPhone SE2 (iOS Safari)

---

## 📁 ファイル構成

```
konomi-app/
├── index.html              # ランチャー画面
├── puzzle.html             # ジグソーパズル
├── matching.html           # 絵合わせ
├── drawing.html            # おえかき [新規]
├── colors.html             # いろあわせ [新規]
├── rhythm.html             # リズムゲーム [新規]
│
├── css/
│   ├── common.css          # 共通スタイル
│   ├── components.css      # 共通コンポーネント
│   └── animations.css      # アニメーション定義
│
├── js/
│   ├── sound.js            # サウンドシステム
│   ├── utils.js            # ユーティリティ
│   ├── storage.js          # ローカルストレージ
│   └── particle.js         # パーティクルエフェクト
│
├── assets/
│   ├── images/
│   │   ├── puzzle/         # パズル用画像
│   │   └── matching/       # 絵合わせ用画像
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── favicon.ico
│
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── .nojekyll               # GitHub Pages用
└── docs/
    ├── GDD.md
    ├── TECH_SPEC.md        # このファイル
    └── UI_SPEC.md
```

---

## 🚨 PWA 404問題の根本解決

### 問題の原因
GitHub Pages では `/konomi-game-ace6463d/` というベースパスが必要だが、以下の問題があった：

1. **manifest.json内のアイコンパス**: 相対パス `icon-192.png` → 404
2. **Service Workerの登録パス**: 相対パス `sw.js` → スコープ問題
3. **start_url**: `/konomi-game-ace6463d/` は正しいが、他のパスが不整合
4. **index.htmlでのリソース読み込み**: 相対パスと絶対パスの混在

### 解決策

#### 1. manifest.json の修正
```json
{
  "name": "このみちゃんのゲーム",
  "short_name": "このみゲーム",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "icons": [
    {
      "src": "./assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "./assets/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**変更点:**
- `start_url` と `scope` を相対パス `./` に（環境非依存）
- アイコンパスを `./assets/icons/` に統一

#### 2. Service Worker (sw.js) の修正
```javascript
const CACHE_NAME = 'konomi-game-v2';
const BASE_PATH = self.location.pathname.replace(/\/[^/]*$/, '');

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/puzzle.html`,
  `${BASE_PATH}/matching.html`,
  `${BASE_PATH}/drawing.html`,
  `${BASE_PATH}/colors.html`,
  `${BASE_PATH}/rhythm.html`,
  `${BASE_PATH}/css/common.css`,
  `${BASE_PATH}/css/components.css`,
  `${BASE_PATH}/css/animations.css`,
  `${BASE_PATH}/js/sound.js`,
  `${BASE_PATH}/js/utils.js`,
  `${BASE_PATH}/js/storage.js`,
  `${BASE_PATH}/js/particle.js`,
  `${BASE_PATH}/assets/icons/icon-192.png`,
  `${BASE_PATH}/assets/icons/icon-512.png`
];

// Install, Activate, Fetch は既存のまま
```

**変更点:**
- `BASE_PATH` を動的取得（`self.location.pathname` から算出）
- 環境に依存しない設計

#### 3. index.html の修正
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
  <link rel="manifest" href="./manifest.json">
  <link rel="icon" href="./assets/icons/favicon.ico">
  <link rel="apple-touch-icon" href="./assets/icons/icon-192.png">
  <link rel="stylesheet" href="./css/common.css">
  <link rel="stylesheet" href="./css/components.css">
  <link rel="stylesheet" href="./css/animations.css">
</head>

<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(reg => console.log('✅ SW registered:', reg.scope))
        .catch(err => console.error('❌ SW failed:', err));
    });
  }
</script>
```

**変更点:**
- すべてのパスを `./` から始める相対パス形式に統一
- Service Worker登録時に `scope: './'` を明示

#### 4. .nojekyll ファイル追加
GitHub Pages は Jekyll を使うため、`_` で始まるファイルを無視する。これを防ぐため：

```bash
touch .nojekyll
```

#### 5. ローカルテスト環境
```bash
cd /Users/nizom/clawd/games/konomi-app
python3 -m http.server 8080
```

→ `http://localhost:8080/` で動作確認

#### 6. 実機テスト（Cloudflare Tunnel）
```bash
cloudflared tunnel --url http://localhost:8080
```

→ iOSデバイスで公開URLにアクセス → ホーム画面に追加 → 起動確認

---

## 🎨 共通モジュール設計

### CSS変数 (css/common.css)

```css
:root {
  /* カラーパレット */
  --primary-pink: #FF9EC8;
  --primary-blue: #A8D8FF;
  --primary-yellow: #FFF4A8;
  --primary-green: #B8F0B8;
  
  --bg-gradient-1: linear-gradient(135deg, #FFE5F1 0%, #D4E4FF 100%);
  --bg-gradient-2: linear-gradient(135deg, #FFF4E8 0%, #FFE8F5 100%);
  
  --text-primary: #333;
  --text-secondary: #666;
  --text-muted: #999;
  
  /* フォント */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", sans-serif;
  --font-xs: 12px;
  --font-sm: 14px;
  --font-md: 16px;
  --font-lg: 20px;
  --font-xl: 24px;
  --font-2xl: 32px;
  
  /* スペーシング */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 角丸 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  /* シャドウ */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.15);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.2);
  
  /* セーフエリア (iPhone) */
  --safe-top: env(safe-area-inset-top, 20px);
  --safe-bottom: env(safe-area-inset-bottom, 34px);
  --safe-left: env(safe-area-inset-left, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
  
  /* タッチターゲット */
  --touch-min: 48px;
}
```

### 共通コンポーネント (css/components.css)

```css
/* ボタン */
.btn {
  min-height: var(--touch-min);
  min-width: var(--touch-min);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-md);
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-sm);
}

/* カード */
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
}

/* 固定ボタン（戻る・音量等） */
.fixed-btn {
  position: fixed;
  width: var(--touch-min);
  height: var(--touch-min);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-xl);
  box-shadow: var(--shadow-lg);
  z-index: 100;
}

.back-btn {
  top: calc(var(--safe-top) + var(--spacing-md));
  left: var(--spacing-md);
  background: white;
}

.sound-btn {
  top: calc(var(--safe-top) + var(--spacing-md));
  right: var(--spacing-md);
  background: var(--primary-pink);
  color: white;
}
```

### アニメーション (css/animations.css)

```css
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(180deg);
  }
}

@keyframes confetti {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(100vh) rotate(360deg);
  }
}
```

---

## 🔊 サウンドシステム設計 (js/sound.js)

### Web Audio API 使用方針

```javascript
class GameSound {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.initialized = false;
    this.gainNode = null;
  }
  
  // iOS対応: ユーザー操作後に初期化
  init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3; // デフォルト音量
      this.initialized = true;
    } catch (e) {
      console.error('AudioContext failed:', e);
    }
  }
  
  // タップ音（440Hz、50ms）
  playTap() {
    if (!this.enabled) return;
    this.init();
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.gainNode);
    
    osc.frequency.value = 440;
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);
  }
  
  // 正解音（ピンポーン）
  playCorrect() {
    if (!this.enabled) return;
    this.init();
    
    const notes = [523.25, 659.25]; // C5, E5
    notes.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.gainNode);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      const startTime = this.audioContext.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }
  
  // クリア音（ファンファーレ）
  playClear() {
    if (!this.enabled) return;
    this.init();
    
    const melody = [
      { freq: 523.25, time: 0 },     // C5
      { freq: 659.25, time: 0.15 },  // E5
      { freq: 783.99, time: 0.3 },   // G5
      { freq: 1046.50, time: 0.5 }   // C6
    ];
    
    melody.forEach(note => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.gainNode);
      
      osc.frequency.value = note.freq;
      osc.type = 'triangle';
      
      const startTime = this.audioContext.currentTime + note.time;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }
  
  // BGM生成（シンプルなループ）
  playBGM(melody = []) {
    // 各ゲーム固有のメロディ配列を受け取る
    // 実装は各ゲームで定義
  }
  
  // ミュート切り替え
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
  
  // 音量設定
  setVolume(value) {
    if (this.gainNode) {
      this.gainNode.gain.value = value;
    }
  }
}

// グローバルインスタンス
const gameSound = new GameSound();
```

### iOS Safari対応の重要ポイント

1. **AudioContext初期化タイミング**: 必ずユーザー操作（タップ等）後
2. **初回タップで init() 実行**: 各ゲームの開始時に確実に呼ぶ
3. **自動再生禁止対応**: BGMは手動開始のみ

---

## 🗂️ ユーティリティ (js/utils.js)

```javascript
// 配列シャッフル (Fisher-Yates)
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ランダム整数
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 要素の位置取得（タッチ対応）
function getPos(e) {
  const touch = e.touches ? e.touches[0] : e;
  return {
    x: touch.clientX,
    y: touch.clientY
  };
}

// 2点間の距離
function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ローカルストレージ保存
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Save failed:', e);
  }
}

// ローカルストレージ読み込み
function loadData(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('Load failed:', e);
    return defaultValue;
  }
}
```

---

## 🎆 パーティクルエフェクト (js/particle.js)

```javascript
// 紙吹雪エフェクト
function createConfetti(container) {
  const colors = ['#FF9EC8', '#A8D8FF', '#FFF4A8', '#B8F0B8'];
  const count = 50;
  
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[i % colors.length]};
      left: ${Math.random() * 100}%;
      top: -10px;
      animation: confetti ${2 + Math.random() * 2}s ease-out forwards;
      animation-delay: ${Math.random() * 0.5}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      z-index: 9999;
    `;
    container.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 4000);
  }
}

// 星エフェクト
function createStars(container) {
  const count = 30;
  
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.textContent = '⭐';
    star.style.cssText = `
      position: fixed;
      font-size: ${16 + Math.random() * 16}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: sparkle 1.5s ease-in-out infinite;
      animation-delay: ${Math.random() * 1}s;
      pointer-events: none;
      z-index: 9999;
    `;
    container.appendChild(star);
    
    setTimeout(() => star.remove(), 3000);
  }
}
```

---

## 💾 状態管理設計

### ローカルストレージキー
```javascript
const STORAGE_KEYS = {
  PUZZLE_BEST_TIME: 'puzzle_best_time',
  MATCHING_HIGH_SCORE: 'matching_high_score',
  DRAWING_LAST_SAVE: 'drawing_last_save',
  COLORS_PROGRESS: 'colors_progress',
  RHYTHM_HIGH_SCORE: 'rhythm_high_score',
  SOUND_ENABLED: 'sound_enabled',
  COMPLETED_GAMES: 'completed_games'
};
```

### データ構造例
```javascript
// パズル
{
  bestTime: 120,  // 秒
  lastPlayed: '2026-02-01T10:30:00Z'
}

// 絵合わせ
{
  highScore: 15,  // 手数
  lastPlayed: '2026-02-01T11:00:00Z'
}

// おえかき
{
  canvas: 'data:image/png;base64,...',
  lastModified: '2026-02-01T11:30:00Z'
}

// いろあわせ
{
  level: 2,  // 1=かんたん, 2=ふつう, 3=むずかしい
  totalCorrect: 50
}

// リズムゲーム
{
  song1_highScore: 85,
  song2_highScore: 92,
  song3_highScore: 78
}
```

---

## 📱 iPhone SE2 最適化

### ビューポート設定
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

### セーフエリア対応
```css
body {
  padding-top: var(--safe-top);
  padding-bottom: var(--safe-bottom);
  padding-left: var(--safe-left);
  padding-right: var(--safe-right);
}
```

### タッチイベント最適化
```css
* {
  touch-action: manipulation; /* ダブルタップズーム防止 */
  -webkit-tap-highlight-color: transparent; /* タップハイライト無効 */
}
```

### パフォーマンス
- Canvas描画: `requestAnimationFrame()` 使用
- CSSアニメーション: `transform`, `opacity` のみ（GPU加速）
- 画像: WebP形式（フォールバックPNG）

---

## 🧪 テスト戦略

### ローカルテスト
1. Chrome DevTools → Device Mode → iPhone SE
2. Lighthouse監査（PWA, Performance, Accessibility）
3. 各ゲームの動作確認

### 実機テスト
1. Cloudflare Tunnel で公開
2. iPhone SE2実機でアクセス
3. チェック項目：
   - ホーム画面に追加 → 404なし
   - 各ゲームの動作
   - サウンド再生
   - タッチ操作の反応速度
   - セーフエリア表示

---

## 🚀 デプロイフロー

```bash
# 1. ビルド（不要、静的ファイルのみ）

# 2. Git管理
cd /Users/nizom/clawd/games/konomi-app
git add .
git commit -m "🎮 v2.0 完全リビルド"
git push origin master

# 3. GitHub Pages自動デプロイ
# https://ximanuki.github.io/konomi-game-ace6463d/

# 4. 動作確認
# - PWA インストール確認
# - 全ゲーム動作確認
```

---

## 📊 技術スタック

| レイヤー | 技術 |
|---------|------|
| HTML | HTML5 (セマンティック) |
| CSS | CSS3 + CSS Variables |
| JavaScript | ES6+ (Vanilla JS) |
| Audio | Web Audio API |
| Graphics | Canvas API |
| Storage | LocalStorage API |
| PWA | Service Worker + Manifest |
| Hosting | GitHub Pages |

**外部依存:** なし（完全自己完結）

---

## 🔒 セキュリティ・プライバシー

- データは全てローカル保存（サーバー通信なし）
- 外部リンクなし
- 広告なし
- トラッキングなし
- 子供に安全

---

**作成者:** モルト 🍺  
**バージョン:** 2.0  
**最終更新:** 2026-02-01

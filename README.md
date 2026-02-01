# 🎮 このみちゃんのゲーム

**対象**: このみちゃん（6歳）  
**デバイス**: iPhone SE2 (375×667 CSS px)  
**コンセプト**: 安全で楽しく、達成感のある学びと遊びの体験

## 🌐 公開URL

**GitHub Pages**: https://ximanuki.github.io/konomi-game-ace6463d/

PWAとしてホーム画面に追加できます 📱

## 🎯 収録ゲーム

### ✅ 実装済み
- **🧩 ジグソーパズル** - 画像を元に戻すパズルゲーム
- **🎴 絵合わせゲーム** - 同じ絵を2枚見つける神経衰弱

### 🚧 準備中
- **🎨 おえかき** - 自由にお絵描きできるキャンバス
- **🌈 いろあわせ** - 色の名前を学ぶマッチングゲーム
- **🎵 リズムゲーム** - 音楽に合わせてタップ

## 🛠️ 技術仕様

### フロントエンド
- **HTML5** - セマンティックマークアップ
- **CSS3** - CSS Variables, Flexbox, Grid, Animations
- **JavaScript (ES6+)** - Vanilla JS（フレームワークなし）

### PWA対応
- **Service Worker** - オフライン動作
- **Manifest** - ホーム画面追加
- **キャッシュ戦略** - Cache First with Network Fallback

### デザイン
- **ターゲット解像度**: 375×667px (iPhone SE2)
- **カラースキーム**: パステルカラー（ピンク・ブルー・イエロー）
- **タイポグラフィ**: ひらがな・カタカナのみ
- **アニメーション**: CSS Animations + Web Animations API

### サウンド
- **Web Audio API** - 効果音・BGM生成
- **音量コントロール** - ON/OFF切り替え可能
- **ローカルストレージ** - 設定の永続化

## 📁 ディレクトリ構成

```
konomi-app/
├── index.html              # ランチャー画面
├── puzzle.html             # ジグソーパズル
├── matching.html           # 絵合わせゲーム
├── drawing.html            # おえかき（準備中）
├── colors.html             # いろあわせ（準備中）
├── rhythm.html             # リズムゲーム（準備中）
├── manifest.json           # PWAマニフェスト
├── sw.js                   # Service Worker
├── css/
│   ├── common.css          # 共通スタイル（変数・リセット）
│   ├── components.css      # UIコンポーネント
│   └── animations.css      # アニメーション定義
├── js/
│   ├── sound.js            # サウンド管理
│   ├── utils.js            # ユーティリティ関数
│   ├── storage.js          # ローカルストレージ管理
│   ├── particle.js         # パーティクルエフェクト
│   └── achievements.js     # 実績システム
├── assets/
│   └── icons/              # PWAアイコン
│       ├── icon-192.png
│       └── icon-512.png
└── docs/
    ├── GDD.md              # ゲームデザインドキュメント
    ├── UI_SPEC.md          # UI/UX仕様書
    ├── TECH_SPEC.md        # 技術仕様書
    └── ACHIEVEMENT_SYSTEM.md # 実績システム仕様
```

## 🎨 デザイン原則

1. **大きなタッチターゲット** - 最小48×48px
2. **明確な視覚フィードバック** - タップ時の反応
3. **ひらがな表記** - 6歳児が読める
4. **パステルカラー** - 目に優しい配色
5. **楽しい音** - 耳障りにならない、オフ可能

## 🚀 ローカル開発

### 起動方法
```bash
# ローカルサーバー起動（例: Python）
python3 -m http.server 8000

# または Node.js
npx http-server -p 8000

# ブラウザで開く
open http://localhost:8000
```

### Service Worker無効化（開発時）
```javascript
// Chrome DevTools > Application > Service Workers > Unregister
```

## 📝 変更履歴

### v2.0 (2026-02-01)
- ✅ ランチャー画面実装
- ✅ 実績バッジシステム追加
- ✅ PWA対応完了
- ✅ 共通CSS/JS統合
- ✅ ジグソーパズル実装
- ✅ 絵合わせゲーム実装
- 🚧 おえかき（準備中）
- 🚧 いろあわせ（準備中）
- 🚧 リズムゲーム（準備中）

### v1.0 (2026-01-31)
- 初期プロトタイプ
- 基本UI実装

## 👤 作成者

**モルト** 🍺  
XIMANUKIくんのためのゲームアプリ開発プロジェクト

---

Made with ♥ for このみちゃん

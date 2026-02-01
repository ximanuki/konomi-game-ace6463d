/**
 * このみちゃんゲーム - 実績・アンロックシステム
 */

const STORAGE_KEYS = {
  ACHIEVEMENTS: 'konomi_achievements',
  UNLOCKS: 'konomi_unlocks',
  GALLERY: 'konomi_gallery',
  FLOWERS: 'konomi_flowers',
  DAILY_STREAK: 'konomi_daily_streak'
};

/**
 * 実績定義
 */
const ACHIEVEMENTS = {
  // ジグソーパズル
  puzzle_first: { name: 'はじめてのパズル！', desc: '1かいクリア', reward: 'スタンプ🧩' },
  puzzle_5: { name: 'パズルマスター', desc: '5かいクリア', reward: 'パズル画像🐶' },
  puzzle_10: { name: 'パズルはかせ！', desc: '10かいクリア', reward: 'パズル画像🚂' },
  puzzle_fast: { name: 'スピードクリア！', desc: '3ぷんいないクリア', reward: 'スタンプ⚡' },
  puzzle_all: { name: 'ぜんぶクリア！', desc: 'ぜんぶのえでクリア', reward: 'スタンプ👑' },
  
  // 絵合わせ
  match_first: { name: 'はじめてのえあわせ！', desc: '1かいクリア', reward: 'スタンプ🎴' },
  match_5: { name: 'きおくマスター', desc: '5かいクリア', reward: 'カード絵柄のりもの' },
  match_10: { name: 'きおくはかせ！', desc: '10かいクリア', reward: 'カード絵柄きせつ' },
  match_perfect: { name: 'パーフェクト！', desc: '12てでクリア', reward: 'スタンプ✨' },
  
  // おえかき
  draw_first: { name: 'はじめてのおえかき！', desc: '1さくひんほぞん', reward: 'スタンプ🖌️' },
  draw_5: { name: 'アーティスト', desc: '5さくひんほぞん', reward: 'スタンプきせつセット' },
  draw_10: { name: 'おえかきマスター！', desc: '10さくひんほぞん', reward: 'スタンプどうぶつセット' },
  draw_all_colors: { name: 'いろマスター！', desc: 'ぜんぶのいろをつかった', reward: 'スタンプ🌈' },
  draw_full: { name: 'ギャラリーいっぱい！', desc: '10さくひんでまんぱい', reward: 'スタンプ🎨' },
  
  // いろあわせ
  color_first: { name: 'はじめてのいろ！', desc: '1かいクリア', reward: 'スタンプ🌈' },
  color_10: { name: 'いろはかせ', desc: 'せいかい10かい', reward: 'なんいど ふつう' },
  color_50: { name: 'いろマスター！', desc: 'せいかい50かい', reward: 'なんいど むずかしい' },
  color_perfect: { name: 'パーフェクト！', desc: '10れんぞくせいかい', reward: 'スタンプ🎨' },
  
  // リズムゲーム
  rhythm_first: { name: 'はじめてのリズム！', desc: '1きょくクリア', reward: 'スタンプ🎵' },
  rhythm_all: { name: 'ぜんぶのきょく！', desc: 'ぜんきょくクリア', reward: 'スタンプ🎶' },
  rhythm_perfect: { name: 'パーフェクト！', desc: 'Perfect 10かい', reward: 'スタンプ⭐' },
  rhythm_high: { name: 'ハイスコア！', desc: '90てんいじょう', reward: 'スタンプ🏆' },
  
  // おはなそだて
  flower_first: { name: 'はじめてのおはな！', desc: '1ぼんかいか', reward: 'スタンプ🌸' },
  flower_5: { name: 'ガーデナー', desc: '5ぼんかいか', reward: 'たね🌻' },
  flower_10: { name: 'おはなマスター！', desc: '10ぼんかいか', reward: 'たね🌹' },
  flower_all: { name: 'おはなはかせ！', desc: 'ぜんしゅるいかいか', reward: 'スタンプ💐' },
  
  // 総合
  total_10: { name: 'ゲームマスター', desc: 'じっせき10こ', reward: 'しょうごう マスター' },
  total_20: { name: 'ゲームはかせ', desc: 'じっせき20こ', reward: 'しょうごう はかせ' },
  total_all: { name: 'ぜんぶクリア！', desc: 'ぜんじっせきたっせい', reward: 'しょうごう でんせつ' },
  daily_7: { name: 'まいにちあそぶ！', desc: '7にちれんぞく', reward: 'スタンプ📅' }
};

/**
 * 実績管理クラス
 */
class AchievementManager {
  /**
   * 実績データ初期化
   */
  static init() {
    const data = loadData(STORAGE_KEYS.ACHIEVEMENTS, {});
    saveData(STORAGE_KEYS.ACHIEVEMENTS, data);
    
    const unlocks = loadData(STORAGE_KEYS.UNLOCKS, {
      puzzles: ['cat', 'strawberry', 'sakura'],
      matching_themes: ['animals', 'fruits'],
      stamps: ['star', 'heart', 'smile', 'sakura', 'cat', 'apple'],
      flowers: ['sakura', 'tulip']
    });
    saveData(STORAGE_KEYS.UNLOCKS, unlocks);
  }

  /**
   * 実績チェック
   * @param {string} achievementId - 実績ID
   * @returns {boolean} 新規達成したか
   */
  static check(achievementId) {
    const data = loadData(STORAGE_KEYS.ACHIEVEMENTS, {});
    
    if (data[achievementId]?.unlocked) {
      return false; // 既に達成済み
    }
    
    // 実績達成
    data[achievementId] = {
      unlocked: true,
      date: new Date().toISOString()
    };
    saveData(STORAGE_KEYS.ACHIEVEMENTS, data);
    
    // 報酬付与
    this.grantReward(achievementId);
    
    // 総合実績チェック
    this.checkTotalAchievements();
    
    return true;
  }

  /**
   * 進捗更新
   * @param {string} achievementId - 実績ID
   * @param {number} progress - 進捗値
   */
  static updateProgress(achievementId, progress) {
    const data = loadData(STORAGE_KEYS.ACHIEVEMENTS, {});
    
    if (!data[achievementId]) {
      data[achievementId] = { unlocked: false, progress: 0 };
    }
    
    if (!data[achievementId].unlocked) {
      data[achievementId].progress = progress;
      saveData(STORAGE_KEYS.ACHIEVEMENTS, data);
    }
  }

  /**
   * 報酬付与
   * @param {string} achievementId - 実績ID
   */
  static grantReward(achievementId) {
    const unlocks = loadData(STORAGE_KEYS.UNLOCKS, {});
    
    // 報酬マッピング
    const rewards = {
      puzzle_5: () => unlocks.puzzles.push('dog'),
      puzzle_10: () => unlocks.puzzles.push('train'),
      puzzle_fast: () => unlocks.stamps.push('thunder'),
      puzzle_all: () => unlocks.stamps.push('crown'),
      
      match_5: () => unlocks.matching_themes.push('vehicles'),
      match_10: () => unlocks.matching_themes.push('seasons'),
      match_perfect: () => unlocks.stamps.push('sparkle'),
      
      draw_5: () => unlocks.stamps.push('sunflower', 'maple', 'snow', 'rainbow'),
      draw_10: () => unlocks.stamps.push('dog', 'rabbit', 'panda', 'frog', 'pig', 'chick'),
      draw_all_colors: () => unlocks.stamps.push('rainbow2'),
      draw_full: () => unlocks.stamps.push('palette'),
      
      flower_5: () => unlocks.flowers.push('sunflower'),
      flower_10: () => unlocks.flowers.push('rose'),
      flower_all: () => unlocks.stamps.push('bouquet'),
      
      total_10: () => { /* 称号付与 */ },
      total_20: () => { /* 称号付与 */ },
      daily_7: () => unlocks.stamps.push('calendar')
    };
    
    if (rewards[achievementId]) {
      rewards[achievementId]();
      saveData(STORAGE_KEYS.UNLOCKS, unlocks);
    }
  }

  /**
   * 総合実績チェック
   */
  static checkTotalAchievements() {
    const count = this.getUnlockedCount();
    
    if (count >= 10 && !this.isUnlocked('total_10')) {
      this.check('total_10');
    }
    if (count >= 20 && !this.isUnlocked('total_20')) {
      this.check('total_20');
    }
    if (count >= Object.keys(ACHIEVEMENTS).length && !this.isUnlocked('total_all')) {
      this.check('total_all');
    }
  }

  /**
   * 実績達成済みか
   * @param {string} achievementId - 実績ID
   * @returns {boolean}
   */
  static isUnlocked(achievementId) {
    const data = loadData(STORAGE_KEYS.ACHIEVEMENTS, {});
    return data[achievementId]?.unlocked || false;
  }

  /**
   * 達成済み実績数
   * @returns {number}
   */
  static getUnlockedCount() {
    const data = loadData(STORAGE_KEYS.ACHIEVEMENTS, {});
    return Object.values(data).filter(a => a.unlocked).length;
  }

  /**
   * 全実績データ取得
   * @returns {array}
   */
  static getAll() {
    const data = loadData(STORAGE_KEYS.ACHIEVEMENTS, {});
    return Object.entries(ACHIEVEMENTS).map(([id, info]) => ({
      id,
      ...info,
      unlocked: data[id]?.unlocked || false,
      progress: data[id]?.progress || 0,
      date: data[id]?.date
    }));
  }

  /**
   * 実績達成通知表示
   * @param {string} achievementId - 実績ID
   */
  static showNotification(achievementId) {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal achievement-modal';
    modal.innerHTML = `
      <div class="achievement-badge">🏆</div>
      <h2>🎉 じっせきたっせい！</h2>
      <h3>${achievement.name}</h3>
      <p>${achievement.desc}</p>
      <div class="reward-box">
        <p>ごうほう</p>
        <div class="reward">${achievement.reward}</div>
      </div>
      <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">
        やった！
      </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // エフェクト
    createConfetti();
    gameSound.playClear();
  }
}

/**
 * ギャラリー管理（おえかき作品）
 */
class GalleryManager {
  static MAX_ITEMS = 10;

  /**
   * 作品保存
   * @param {string} dataURL - Canvas の toDataURL()
   * @param {string} title - 作品タイトル
   */
  static save(dataURL, title = null) {
    const gallery = loadData(STORAGE_KEYS.GALLERY, []);
    
    // サムネイル生成（小さいサイズ）
    const thumbnail = this.createThumbnail(dataURL);
    
    const item = {
      id: `draw_${Date.now()}`,
      thumbnail: thumbnail,
      full: dataURL,
      date: new Date().toISOString(),
      title: title || `おえかき${gallery.length + 1}`
    };
    
    gallery.push(item);
    
    // 最大数制限
    if (gallery.length > this.MAX_ITEMS) {
      gallery.shift(); // 古いものを削除
    }
    
    saveData(STORAGE_KEYS.GALLERY, gallery);
    
    // 実績チェック
    this.checkAchievements(gallery.length);
    
    return item.id;
  }

  /**
   * サムネイル生成
   * @param {string} dataURL - 元画像
   * @returns {string} サムネイルdataURL
   */
  static createThumbnail(dataURL) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 100;
    canvas.height = 100;
    
    img.src = dataURL;
    ctx.drawImage(img, 0, 0, 100, 100);
    
    return canvas.toDataURL('image/png', 0.7);
  }

  /**
   * 全作品取得
   * @returns {array}
   */
  static getAll() {
    return loadData(STORAGE_KEYS.GALLERY, []);
  }

  /**
   * 作品取得
   * @param {string} id - 作品ID
   * @returns {object}
   */
  static get(id) {
    const gallery = this.getAll();
    return gallery.find(item => item.id === id);
  }

  /**
   * 作品削除
   * @param {string} id - 作品ID
   */
  static delete(id) {
    let gallery = this.getAll();
    gallery = gallery.filter(item => item.id !== id);
    saveData(STORAGE_KEYS.GALLERY, gallery);
  }

  /**
   * 実績チェック
   * @param {number} count - 作品数
   */
  static checkAchievements(count) {
    if (count >= 1 && !AchievementManager.isUnlocked('draw_first')) {
      AchievementManager.check('draw_first');
      AchievementManager.showNotification('draw_first');
    }
    if (count >= 5 && !AchievementManager.isUnlocked('draw_5')) {
      AchievementManager.check('draw_5');
      AchievementManager.showNotification('draw_5');
    }
    if (count >= 10 && !AchievementManager.isUnlocked('draw_10')) {
      AchievementManager.check('draw_10');
      AchievementManager.showNotification('draw_10');
    }
    if (count >= this.MAX_ITEMS && !AchievementManager.isUnlocked('draw_full')) {
      AchievementManager.check('draw_full');
      AchievementManager.showNotification('draw_full');
    }
  }
}

/**
 * 連続プレイ管理
 */
class DailyStreakManager {
  /**
   * 今日プレイしたか記録
   */
  static recordToday() {
    const data = loadData(STORAGE_KEYS.DAILY_STREAK, {
      current: 0,
      longest: 0,
      lastPlayed: null
    });
    
    const today = new Date().toISOString().split('T')[0];
    
    if (data.lastPlayed === today) {
      return; // 既に記録済み
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (data.lastPlayed === yesterdayStr) {
      // 連続プレイ
      data.current += 1;
    } else if (data.lastPlayed === null || data.lastPlayed < yesterdayStr) {
      // 連続途切れた
      data.current = 1;
    }
    
    data.longest = Math.max(data.longest, data.current);
    data.lastPlayed = today;
    
    saveData(STORAGE_KEYS.DAILY_STREAK, data);
    
    // 実績チェック
    if (data.current >= 7 && !AchievementManager.isUnlocked('daily_7')) {
      AchievementManager.check('daily_7');
      AchievementManager.showNotification('daily_7');
    }
  }

  /**
   * 現在の連続日数取得
   * @returns {number}
   */
  static getCurrent() {
    const data = loadData(STORAGE_KEYS.DAILY_STREAK, { current: 0 });
    return data.current;
  }

  /**
   * 最長連続日数取得
   * @returns {number}
   */
  static getLongest() {
    const data = loadData(STORAGE_KEYS.DAILY_STREAK, { longest: 0 });
    return data.longest;
  }
}

// 初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AchievementManager.init();
    DailyStreakManager.recordToday();
  });
} else {
  AchievementManager.init();
  DailyStreakManager.recordToday();
}

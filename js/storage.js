/**
 * このみちゃんゲーム - ストレージ管理
 * ゲームの進捗・設定を管理
 */

const STORAGE_KEYS = {
  // ゲーム進捗
  PUZZLE_BEST_TIME: 'konomi_puzzle_best_time',
  MATCHING_HIGH_SCORE: 'konomi_matching_high_score',
  COLORS_PROGRESS: 'konomi_colors_progress',
  RHYTHM_HIGH_SCORE: 'konomi_rhythm_high_score',
  DRAWING_LAST_SAVE: 'konomi_drawing_last_save',
  
  // 設定
  SOUND_ENABLED: 'konomi_sound_enabled',
  COMPLETED_GAMES: 'konomi_completed_games',
  
  // 統計
  TOTAL_PLAY_TIME: 'konomi_total_play_time',
  LAST_PLAYED: 'konomi_last_played'
};

/**
 * ゲーム進捗管理クラス
 */
class GameProgress {
  /**
   * パズルのベストタイムを保存
   * @param {number} time - 秒数
   */
  static savePuzzleBestTime(time) {
    const current = this.getPuzzleBestTime();
    if (current === null || time < current) {
      saveData(STORAGE_KEYS.PUZZLE_BEST_TIME, {
        time: time,
        date: new Date().toISOString()
      });
      return true; // 新記録
    }
    return false;
  }

  /**
   * パズルのベストタイムを取得
   * @returns {number|null}
   */
  static getPuzzleBestTime() {
    const data = loadData(STORAGE_KEYS.PUZZLE_BEST_TIME);
    return data ? data.time : null;
  }

  /**
   * 絵合わせのハイスコアを保存（少ない手数が良い）
   * @param {number} moves - 手数
   */
  static saveMatchingHighScore(moves) {
    const current = this.getMatchingHighScore();
    if (current === null || moves < current) {
      saveData(STORAGE_KEYS.MATCHING_HIGH_SCORE, {
        moves: moves,
        date: new Date().toISOString()
      });
      return true;
    }
    return false;
  }

  /**
   * 絵合わせのハイスコアを取得
   * @returns {number|null}
   */
  static getMatchingHighScore() {
    const data = loadData(STORAGE_KEYS.MATCHING_HIGH_SCORE);
    return data ? data.moves : null;
  }

  /**
   * いろあわせの進捗を保存
   * @param {number} level - レベル
   * @param {number} correct - 正解数
   */
  static saveColorsProgress(level, correct) {
    const data = loadData(STORAGE_KEYS.COLORS_PROGRESS, {
      level: 1,
      totalCorrect: 0,
      history: []
    });
    
    data.level = Math.max(data.level, level);
    data.totalCorrect += correct;
    data.history.push({
      level: level,
      correct: correct,
      date: new Date().toISOString()
    });
    
    // 履歴は最新10件のみ保持
    if (data.history.length > 10) {
      data.history = data.history.slice(-10);
    }
    
    saveData(STORAGE_KEYS.COLORS_PROGRESS, data);
  }

  /**
   * いろあわせの進捗を取得
   * @returns {object}
   */
  static getColorsProgress() {
    return loadData(STORAGE_KEYS.COLORS_PROGRESS, {
      level: 1,
      totalCorrect: 0,
      history: []
    });
  }

  /**
   * リズムゲームのハイスコアを保存
   * @param {string} songId - 曲ID
   * @param {number} score - スコア
   */
  static saveRhythmHighScore(songId, score) {
    const data = loadData(STORAGE_KEYS.RHYTHM_HIGH_SCORE, {});
    
    if (!data[songId] || score > data[songId]) {
      data[songId] = score;
      data[`${songId}_date`] = new Date().toISOString();
      saveData(STORAGE_KEYS.RHYTHM_HIGH_SCORE, data);
      return true;
    }
    return false;
  }

  /**
   * リズムゲームのハイスコアを取得
   * @param {string} songId - 曲ID
   * @returns {number}
   */
  static getRhythmHighScore(songId) {
    const data = loadData(STORAGE_KEYS.RHYTHM_HIGH_SCORE, {});
    return data[songId] || 0;
  }

  /**
   * おえかきを保存
   * @param {string} dataURL - Canvas の toDataURL()
   */
  static saveDrawing(dataURL) {
    saveData(STORAGE_KEYS.DRAWING_LAST_SAVE, {
      image: dataURL,
      date: new Date().toISOString()
    });
  }

  /**
   * おえかきを取得
   * @returns {string|null} dataURL
   */
  static getDrawing() {
    const data = loadData(STORAGE_KEYS.DRAWING_LAST_SAVE);
    return data ? data.image : null;
  }

  /**
   * おえかきを削除
   */
  static clearDrawing() {
    removeData(STORAGE_KEYS.DRAWING_LAST_SAVE);
  }

  /**
   * ゲームクリア記録
   * @param {string} gameId - ゲームID
   */
  static markCompleted(gameId) {
    const data = loadData(STORAGE_KEYS.COMPLETED_GAMES, {});
    
    if (!data[gameId]) {
      data[gameId] = {
        firstClear: new Date().toISOString(),
        count: 0
      };
    }
    
    data[gameId].count += 1;
    data[gameId].lastClear = new Date().toISOString();
    
    saveData(STORAGE_KEYS.COMPLETED_GAMES, data);
  }

  /**
   * ゲームクリア回数を取得
   * @param {string} gameId - ゲームID
   * @returns {number}
   */
  static getCompletedCount(gameId) {
    const data = loadData(STORAGE_KEYS.COMPLETED_GAMES, {});
    return data[gameId] ? data[gameId].count : 0;
  }

  /**
   * 総プレイ時間を記録
   * @param {number} seconds - 追加する秒数
   */
  static addPlayTime(seconds) {
    const current = loadData(STORAGE_KEYS.TOTAL_PLAY_TIME, 0);
    saveData(STORAGE_KEYS.TOTAL_PLAY_TIME, current + seconds);
  }

  /**
   * 総プレイ時間を取得
   * @returns {number} 秒数
   */
  static getTotalPlayTime() {
    return loadData(STORAGE_KEYS.TOTAL_PLAY_TIME, 0);
  }

  /**
   * 最終プレイ日時を記録
   */
  static updateLastPlayed() {
    saveData(STORAGE_KEYS.LAST_PLAYED, new Date().toISOString());
  }

  /**
   * 最終プレイ日時を取得
   * @returns {string|null} ISO日時文字列
   */
  static getLastPlayed() {
    return loadData(STORAGE_KEYS.LAST_PLAYED);
  }

  /**
   * すべてのデータをリセット（危険）
   */
  static resetAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      removeData(key);
    });
  }

  /**
   * すべての進捗を取得（デバッグ用）
   * @returns {object}
   */
  static getAllProgress() {
    return {
      puzzle: {
        bestTime: this.getPuzzleBestTime()
      },
      matching: {
        highScore: this.getMatchingHighScore()
      },
      colors: this.getColorsProgress(),
      rhythm: loadData(STORAGE_KEYS.RHYTHM_HIGH_SCORE, {}),
      completed: loadData(STORAGE_KEYS.COMPLETED_GAMES, {}),
      totalPlayTime: this.getTotalPlayTime(),
      lastPlayed: this.getLastPlayed()
    };
  }
}

/**
 * 設定管理クラス
 */
class GameSettings {
  /**
   * サウンド設定を保存
   * @param {boolean} enabled
   */
  static setSoundEnabled(enabled) {
    saveData(STORAGE_KEYS.SOUND_ENABLED, enabled);
  }

  /**
   * サウンド設定を取得
   * @returns {boolean}
   */
  static getSoundEnabled() {
    return loadData(STORAGE_KEYS.SOUND_ENABLED, true); // デフォルトON
  }
}

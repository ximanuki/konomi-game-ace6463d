/**
 * このみちゃんゲーム - ユーティリティ関数
 */

/**
 * 配列をシャッフル (Fisher-Yates)
 * @param {array} array - シャッフルする配列
 * @returns {array} シャッフルされた新しい配列
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * ランダムな整数を生成
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @returns {number} ランダムな整数
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * タッチ/マウスイベントから座標を取得
 * @param {Event} e - イベントオブジェクト
 * @returns {object} {x, y}
 */
function getPos(e) {
  const touch = e.touches ? e.touches[0] : e;
  return {
    x: touch.clientX,
    y: touch.clientY
  };
}

/**
 * 2点間の距離を計算
 * @param {object} p1 - {x, y}
 * @param {object} p2 - {x, y}
 * @returns {number} 距離
 */
function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * ローカルストレージにデータ保存
 * @param {string} key - キー
 * @param {any} data - 保存するデータ
 */
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('[Storage] Save failed:', e);
  }
}

/**
 * ローカルストレージからデータ読み込み
 * @param {string} key - キー
 * @param {any} defaultValue - デフォルト値
 * @returns {any} 読み込んだデータ
 */
function loadData(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('[Storage] Load failed:', e);
    return defaultValue;
  }
}

/**
 * ローカルストレージからデータ削除
 * @param {string} key - キー
 */
function removeData(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('[Storage] Remove failed:', e);
  }
}

/**
 * 時間をフォーマット (MM:SS)
 * @param {number} seconds - 秒数
 * @returns {string} フォーマットされた時間
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 要素を画面中央に配置
 * @param {HTMLElement} element - 配置する要素
 */
function centerElement(element) {
  const rect = element.getBoundingClientRect();
  element.style.left = `${(window.innerWidth - rect.width) / 2}px`;
  element.style.top = `${(window.innerHeight - rect.height) / 2}px`;
}

/**
 * トースト通知を表示
 * @param {string} message - メッセージ
 * @param {number} duration - 表示時間（ms）
 */
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, duration);
}

/**
 * 確認ダイアログ表示
 * @param {string} message - メッセージ
 * @param {function} onConfirm - 確認時のコールバック
 * @param {function} onCancel - キャンセル時のコールバック
 */
function showConfirm(message, onConfirm, onCancel) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <h2>かくにん</h2>
    <p>${message}</p>
    <div class="modal-buttons">
      <button class="btn btn-primary confirm-yes">はい</button>
      <button class="btn btn-secondary confirm-no">いいえ</button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  const yesBtn = modal.querySelector('.confirm-yes');
  const noBtn = modal.querySelector('.confirm-no');
  
  yesBtn.addEventListener('click', () => {
    gameSound.playTap();
    overlay.remove();
    if (onConfirm) onConfirm();
  });
  
  noBtn.addEventListener('click', () => {
    gameSound.playTap();
    overlay.remove();
    if (onCancel) onCancel();
  });
}

/**
 * 画面向きを縦に固定（試行）
 */
function lockPortrait() {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('portrait').catch(err => {
      console.log('[Orientation] Lock not supported:', err.message);
    });
  }
}

/**
 * 配列をグループ化
 * @param {array} array - 配列
 * @param {number} size - グループサイズ
 * @returns {array} グループ化された配列
 */
function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * 配列から重複を削除
 * @param {array} array - 配列
 * @returns {array} 重複なし配列
 */
function unique(array) {
  return [...new Set(array)];
}

/**
 * 数値を範囲内にクランプ
 * @param {number} value - 値
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @returns {number} クランプされた値
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * 線形補間
 * @param {number} start - 開始値
 * @param {number} end - 終了値
 * @param {number} t - 0-1の補間係数
 * @returns {number} 補間された値
 */
function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * 遅延実行
 * @param {number} ms - 遅延時間（ミリ秒）
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * デバウンス
 * @param {function} func - 関数
 * @param {number} wait - 待機時間（ms）
 * @returns {function} デバウンスされた関数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 触覚フィードバック（対応デバイスのみ）
 * @param {string} type - 'light' | 'medium' | 'heavy'
 */
function vibrate(type = 'light') {
  if (!navigator.vibrate) return;
  
  const patterns = {
    light: 10,
    medium: 20,
    heavy: 30
  };
  
  navigator.vibrate(patterns[type] || patterns.light);
}

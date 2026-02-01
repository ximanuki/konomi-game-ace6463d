/**
 * このみちゃんゲーム - サウンドシステム
 * Web Audio API を使用した効果音・BGM生成
 */

class GameSound {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.initialized = false;
    this.gainNode = null;
    this.bgmOscillators = [];
  }

  /**
   * AudioContext初期化（iOS対応: ユーザー操作後に呼ぶ）
   */
  init() {
    if (this.initialized) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3; // デフォルト音量30%
      this.initialized = true;
      console.log('[Sound] Initialized');
    } catch (e) {
      console.error('[Sound] Failed to initialize:', e);
    }
  }

  /**
   * タップ音（軽い「ポッ」）
   */
  playTap() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.gainNode);
    
    osc.frequency.value = 440; // A4
    osc.type = 'sine';
    
    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * 正解音（ピンポーン♪）
   */
  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const notes = [523.25, 659.25]; // C5, E5
    const now = this.audioContext.currentTime;
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.gainNode);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      const startTime = now + i * 0.15;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  /**
   * 不正解音（優しめ）
   */
  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.gainNode);
    
    osc.frequency.value = 200; // 低めの音
    osc.type = 'sine';
    
    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * クリア音（ファンファーレ）
   */
  playClear() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const melody = [
      { freq: 523.25, time: 0 },     // C5
      { freq: 659.25, time: 0.15 },  // E5
      { freq: 783.99, time: 0.3 },   // G5
      { freq: 1046.50, time: 0.5 }   // C6
    ];
    
    const now = this.audioContext.currentTime;
    
    melody.forEach(note => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.gainNode);
      
      osc.frequency.value = note.freq;
      osc.type = 'triangle';
      
      const startTime = now + note.time;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  /**
   * スナップ音（パズルピース配置）
   */
  playSnap() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.gainNode);
    
    osc.frequency.value = 800;
    osc.type = 'sine';
    
    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * カードフリップ音
   */
  playFlip() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.gainNode);
    
    osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1);
    osc.type = 'square';
    
    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * 色音（ドレミファソラシド）
   * @param {number} index - 色のインデックス（0-7）
   */
  playColorNote(index) {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const scale = [
      261.63, // C4 (ド)
      293.66, // D4 (レ)
      329.63, // E4 (ミ)
      349.23, // F4 (ファ)
      392.00, // G4 (ソ)
      440.00, // A4 (ラ)
      493.88, // B4 (シ)
      523.25  // C5 (ド)
    ];

    const freq = scale[index % scale.length];
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.gainNode);
    
    osc.frequency.value = freq;
    osc.type = 'sine';
    
    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * リズムゲーム判定音
   * @param {string} judge - 'perfect' | 'good' | 'miss'
   */
  playJudge(judge) {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const freqs = {
      perfect: 880,  // A5（高い）
      good: 660,     // E5（中）
      miss: 220      // A3（低い）
    };

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.gainNode);
    
    osc.frequency.value = freqs[judge] || freqs.miss;
    osc.type = judge === 'perfect' ? 'sine' : 'triangle';
    
    const now = this.audioContext.currentTime;
    const volume = judge === 'miss' ? 0.1 : 0.25;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * シンプルBGM（メロディループ）
   * @param {array} melody - 音階配列 [{note, duration}, ...]
   */
  playBGM(melody) {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    this.stopBGM(); // 既存のBGM停止

    let time = this.audioContext.currentTime;
    const bpm = 120;
    const beatDuration = 60 / bpm;

    melody.forEach(({ note, duration }) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.gainNode);
      
      osc.frequency.value = note;
      osc.type = 'sine';
      
      const noteDuration = beatDuration * duration;
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + noteDuration);
      
      osc.start(time);
      osc.stop(time + noteDuration);
      
      this.bgmOscillators.push(osc);
      time += noteDuration;
    });
  }

  /**
   * BGM停止
   */
  stopBGM() {
    this.bgmOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.bgmOscillators = [];
  }

  /**
   * ミュート切り替え
   * @returns {boolean} 新しい状態
   */
  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopBGM();
    }
    return this.enabled;
  }

  /**
   * 音量設定
   * @param {number} value - 0.0-1.0
   */
  setVolume(value) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, value));
    }
  }
}

// グローバルインスタンス
const gameSound = new GameSound();

// 最初のユーザー操作で初期化を試みる
document.addEventListener('touchstart', () => {
  gameSound.init();
}, { once: true });

document.addEventListener('click', () => {
  gameSound.init();
}, { once: true });

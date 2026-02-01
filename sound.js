/* このみちゃんゲーム サウンドシステム */
/* Web Audio API使用 - 外部ファイル不要 */

class GameSound {
    constructor() {
        this.audioCtx = null;
        this.enabled = true;
        this.bgmGain = null;
        this.bgmOscillators = [];
        this.bgmInterval = null;
    }

    // オーディオコンテキスト初期化
    init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioCtx;
    }

    // サウンド有効/無効切り替え
    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopBGM();
        }
        return this.enabled;
    }

    // 基本トーン生成
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled) return;
        this.init();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.frequency.value = frequency;
        osc.type = type;
        
        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
        
        osc.start(this.audioCtx.currentTime);
        osc.stop(this.audioCtx.currentTime + duration);
    }

    // メロディ再生
    playMelody(notes, noteLength = 0.2, volume = 0.3) {
        if (!this.enabled) return;
        this.init();

        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, noteLength, 'sine', volume);
            }, i * noteLength * 1000);
        });
    }

    // SE: タップ音
    playTap() {
        if (!this.enabled) return;
        this.init();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.08);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.08);
    }

    // SE: カードめくり音
    playFlip() {
        if (!this.enabled) return;
        this.init();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, this.audioCtx.currentTime + 0.1);
        osc.type = 'triangle';
        
        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.1);
    }

    // SE: 正解音（ピンポーン♪）
    playCorrect() {
        if (!this.enabled) return;
        this.init();

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.25, 'sine', 0.3);
            }, i * 120);
        });
    }

    // SE: 不正解音（優しいブブッ）
    playWrong() {
        if (!this.enabled) return;
        this.init();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.frequency.setValueAtTime(250, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, this.audioCtx.currentTime + 0.25);
        osc.type = 'sawtooth';
        
        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.25);
    }

    // SE: クリア音（ファンファーレ）
    playWin() {
        if (!this.enabled) return;
        this.init();

        // ファンファーレメロディ
        const melody = [
            523.25,  // C5
            659.25,  // E5
            783.99,  // G5
            1046.50, // C6
            783.99,  // G5
            1046.50, // C6
            1318.51  // E6
        ];
        
        melody.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.35, 'sine', 0.35);
            }, i * 180);
        });
    }

    // SE: ピース配置音
    playPlace() {
        if (!this.enabled) return;
        this.init();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.15);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.15);
    }

    // BGM: 明るく楽しいループBGM
    startBGM() {
        if (!this.enabled) return;
        this.init();

        // 既存のBGMを停止
        this.stopBGM();

        // BGMのボリューム制御
        this.bgmGain = this.audioCtx.createGain();
        this.bgmGain.gain.value = 0.08; // 控えめ
        this.bgmGain.connect(this.audioCtx.destination);

        // シンプルなペンタトニックスケールの明るいメロディ
        const melody = [
            523.25, 587.33, 659.25, 783.99, 880.00, // C D E G A
            783.99, 659.25, 587.33,
            523.25, 659.25, 783.99, 880.00,
            783.99, 659.25, 587.33, 523.25
        ];

        const bassLine = [
            261.63, 261.63, 329.63, 329.63, // C C E E
            392.00, 392.00, 329.63, 329.63, // G G E E
            261.63, 261.63, 329.63, 329.63,
            392.00, 392.00, 329.63, 261.63
        ];

        let noteIndex = 0;
        const noteLength = 0.4; // 秒

        const playNote = () => {
            if (!this.enabled) {
                this.stopBGM();
                return;
            }

            const currentTime = this.audioCtx.currentTime;

            // メロディ
            const melOsc = this.audioCtx.createOscillator();
            const melGain = this.audioCtx.createGain();
            melOsc.connect(melGain);
            melGain.connect(this.bgmGain);
            
            melOsc.frequency.value = melody[noteIndex];
            melOsc.type = 'sine';
            melGain.gain.setValueAtTime(0.3, currentTime);
            melGain.gain.exponentialRampToValueAtTime(0.01, currentTime + noteLength);
            
            melOsc.start(currentTime);
            melOsc.stop(currentTime + noteLength);
            this.bgmOscillators.push(melOsc);

            // ベースライン
            const bassOsc = this.audioCtx.createOscillator();
            const bassGain = this.audioCtx.createGain();
            bassOsc.connect(bassGain);
            bassGain.connect(this.bgmGain);
            
            bassOsc.frequency.value = bassLine[noteIndex];
            bassOsc.type = 'triangle';
            bassGain.gain.setValueAtTime(0.15, currentTime);
            bassGain.gain.exponentialRampToValueAtTime(0.01, currentTime + noteLength);
            
            bassOsc.start(currentTime);
            bassOsc.stop(currentTime + noteLength);
            this.bgmOscillators.push(bassOsc);

            noteIndex = (noteIndex + 1) % melody.length;
        };

        // 最初の音を再生
        playNote();

        // ループ
        this.bgmInterval = setInterval(playNote, noteLength * 1000);
    }

    // BGM停止
    stopBGM() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
        
        this.bgmOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // 既に停止している場合
            }
        });
        this.bgmOscillators = [];
        
        if (this.bgmGain) {
            this.bgmGain.disconnect();
            this.bgmGain = null;
        }
    }
}

// グローバルインスタンス
const gameSound = new GameSound();

// 最初のユーザーインタラクションで初期化
document.addEventListener('click', () => gameSound.init(), { once: true });
document.addEventListener('touchstart', () => gameSound.init(), { once: true });

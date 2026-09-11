/**
 * PRODUCTIVITY MODE & WEB AUDIO ELEVATOR MUZAK
 * Locks the canvas and synthesizes authentic 80s elevator music using Web Audio API.
 */

export class ProductivityManager {
  constructor(onLockoutChange) {
    this.onLockoutChange = onLockoutChange;
    this.totalDuration = 300; // 5 minutes
    this.remainingSeconds = this.totalDuration;
    this.isLocked = false;
    this.timerInterval = null;
    this.lockoutSecondsRemaining = 60; // 60s cooldown

    // Web Audio Synthesizer for Elevator Muzak
    this.audioCtx = null;
    this.isMuzakPlaying = false;
    this.muzakInterval = null;
    this.isMuted = false;

    this.overlay = document.getElementById('productivity-overlay');
    this.timerDisplay = document.getElementById('productivity-seconds');
    this.muteBtn = document.getElementById('btn-toggle-muzak');
    this.dismissBtn = document.getElementById('btn-bypass-productivity');

    this.setupUI();
    this.startInactivityCountdown();
  }

  setupUI() {
    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => {
        this.isMuted = !this.isMuted;
        this.muteBtn.textContent = this.isMuted ? "Unmute Muzak" : "Mute Muzak";
      });
    }

    if (this.dismissBtn) {
      this.dismissBtn.addEventListener('click', () => {
        this.unlockCanvas();
      });
    }
  }

  startInactivityCountdown() {
    this.timerInterval = setInterval(() => {
      if (!this.isLocked) {
        this.remainingSeconds--;
        if (this.remainingSeconds <= 0) {
          this.triggerLockout();
        }
      }
    }, 1000);
  }

  triggerLockout() {
    this.isLocked = true;
    this.lockoutSecondsRemaining = 60;
    if (this.overlay) {
      this.overlay.style.display = 'flex';
    }

    this.startMuzak();

    // Lockout countdown timer
    const lockTimer = setInterval(() => {
      if (!this.isLocked) {
        clearInterval(lockTimer);
        return;
      }
      this.lockoutSecondsRemaining--;
      if (this.timerDisplay) {
        this.timerDisplay.textContent = `${this.lockoutSecondsRemaining}s`;
      }
      if (this.lockoutSecondsRemaining <= 0) {
        clearInterval(lockTimer);
        this.unlockCanvas();
      }
    }, 1000);

    if (this.onLockoutChange) {
      this.onLockoutChange(true);
    }
  }

  unlockCanvas() {
    this.isLocked = false;
    this.remainingSeconds = this.totalDuration;
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
    this.stopMuzak();
    if (this.onLockoutChange) {
      this.onLockoutChange(false);
    }
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Synthesizes 80s Bossa Nova / Elevator Jazz Chords
   */
  startMuzak() {
    this.initAudio();
    if (this.isMuzakPlaying) return;
    this.isMuzakPlaying = true;

    // Jazzy chord progressions in Hertz: Fmaj7 -> G9 -> Em7 -> Am7
    const chords = [
      [349.23, 440.00, 523.25, 659.25], // Fmaj7 (F4, A4, C5, E5)
      [392.00, 493.88, 587.33, 739.99], // G9 (G4, B4, D5, F#5)
      [329.63, 392.00, 493.88, 587.33], // Em7 (E4, G4, B4, D5)
      [440.00, 523.25, 659.25, 783.99]  // Am7 (A4, C5, E5, G5)
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!this.isMuzakPlaying || this.isMuted) return;

      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      const now = this.audioCtx.currentTime;
      currentChord.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle'; // Warm electric piano tone
        osc.frequency.setValueAtTime(freq, now);

        // Soft arpeggio staggered attack
        const startTime = now + (i * 0.08);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.04, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.9);
      });

      // Soft synthesized bossa-nova hi-hat brush
      this.playBrush(now + 0.5);
      this.playBrush(now + 1.0);
    };

    playChord();
    this.muzakInterval = setInterval(playChord, 2000);
  }

  playBrush(time) {
    if (!this.audioCtx || this.isMuted) return;
    try {
      const bufferSize = this.audioCtx.sampleRate * 0.04;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.03;
      }
      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 6000;
      noise.connect(filter);
      filter.connect(this.audioCtx.destination);
      noise.start(time);
    } catch (e) {
      // Audio fallback
    }
  }

  stopMuzak() {
    this.isMuzakPlaying = false;
    if (this.muzakInterval) {
      clearInterval(this.muzakInterval);
      this.muzakInterval = null;
    }
  }
}

/**
 * OVER-ENGINEERED NONSENSE MODULE (SIMPLE ENGLISH)
 * Implements Bad UI assets, AI features, and Bad Exports (Morse Code, ASCII art, and Paper Airplane).
 */

// Morse Code Dictionary
const MORSE_MAP = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ' ': ' / '
};

export function textToMorse(text) {
  return text.toUpperCase().split('').map(ch => MORSE_MAP[ch] || ch).join(' ');
}

/**
 * Web Audio Morse Code Beeper
 */
export class MorseAudioPlayer {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playMorse(morseCode, onFinish) {
    this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.isPlaying = true;

    const dotDuration = 0.08;
    let currentTime = this.audioCtx.currentTime + 0.05;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(0, this.audioCtx.currentTime);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();

    const tokens = morseCode.split('');
    tokens.forEach(token => {
      if (token === '.') {
        gain.gain.setValueAtTime(0.2, currentTime);
        gain.gain.setValueAtTime(0, currentTime + dotDuration);
        currentTime += dotDuration * 2;
      } else if (token === '-') {
        gain.gain.setValueAtTime(0.2, currentTime);
        gain.gain.setValueAtTime(0, currentTime + dotDuration * 3);
        currentTime += dotDuration * 4;
      } else if (token === ' ') {
        currentTime += dotDuration * 2;
      } else if (token === '/') {
        currentTime += dotDuration * 5;
      }
    });

    setTimeout(() => {
      osc.stop();
      this.isPlaying = false;
      if (onFinish) onFinish();
    }, (currentTime - this.audioCtx.currentTime) * 1000);
  }
}

/**
 * Generates ASCII Art of the Canvas Layout
 */
export function generateAsciiArt(elements, title = "Untitled Lost") {
  const width = 64;
  const height = 24;
  const grid = Array.from({ length: height }, () => Array(width).fill(' '));

  // Border
  for (let x = 0; x < width; x++) {
    grid[0][x] = '=';
    grid[height - 1][x] = '=';
  }
  for (let y = 0; y < height; y++) {
    grid[y][0] = '|';
    grid[y][width - 1] = '|';
  }

  // Draw title
  const titleStr = ` [ FIGMA TEXT PICTURE: ${title.substring(0, 30)} ] `;
  for (let i = 0; i < titleStr.length && i < width - 4; i++) {
    grid[0][i + 2] = titleStr[i];
  }

  elements.forEach((el) => {
    const gx = Math.min(width - 14, Math.max(2, Math.floor((el.x / 1000) * (width - 10))));
    const gy = Math.min(height - 6, Math.max(2, Math.floor((el.y / 700) * (height - 6))));
    const gw = Math.min(18, Math.max(8, Math.floor((el.width / 1000) * (width))));
    const gh = Math.min(6, Math.max(3, Math.floor((el.height / 700) * (height))));

    const char = el.type === 'frame' ? '#' : el.type === 'ellipse' ? 'O' : '*';

    for (let dy = 0; dy < gh; dy++) {
      for (let dx = 0; dx < gw; dx++) {
        const py = gy + dy;
        const px = gx + dx;
        if (py < height - 1 && px < width - 1) {
          if (dy === 0 || dy === gh - 1 || dx === 0 || dx === gw - 1) {
            grid[py][px] = char;
          }
        }
      }
    }

    const name = `${el.name.substring(0, gw - 2)}`;
    for (let c = 0; c < name.length && gx + 1 + c < width - 1; c++) {
      if (gy + 1 < height - 1) {
        grid[gy + 1][gx + 1 + c] = name[c];
      }
    }
  });

  return grid.map(row => row.join('')).join('\n');
}

/**
 * Generates SVG Blueprint for Physical Paper Airplane
 */
export function generatePaperAirplaneSvg() {
  return `
    <rect width="400" height="280" fill="#0f111a" rx="8"/>
    <!-- Center Line -->
    <line x1="200" y1="20" x2="200" y2="260" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4"/>
    <text x="205" y="40" fill="#38bdf8" font-size="9" font-family="monospace">STEP 1: Fold design in half</text>

    <!-- Wing Lines Left & Right -->
    <line x1="200" y1="20" x2="40" y2="180" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="50" y="100" fill="#f43f5e" font-size="9" font-family="monospace">STEP 2: Fold wings down</text>
    <line x1="200" y1="20" x2="360" y2="180" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,3"/>

    <!-- Wing Tip Lines -->
    <line x1="120" y1="180" x2="120" y2="260" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="2,2"/>
    <line x1="280" y1="180" x2="280" y2="260" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="2,2"/>
    <text x="145" y="240" fill="#fbbf24" font-size="9" font-family="monospace">STEP 3: Fold wing tips</text>

    <!-- Nose Triangle Guide -->
    <polygon points="200,20 170,80 230,80" fill="rgba(13, 153, 255, 0.2)" stroke="#0d99ff" stroke-width="1"/>
    <text x="175" y="60" fill="#fff" font-size="8" font-family="sans-serif">FRONT TIP</text>

    <!-- Banner -->
    <rect x="50" y="130" width="300" height="30" fill="rgba(255,255,255,0.05)" rx="4"/>
    <text x="200" y="150" fill="#a78bfa" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">
      ✈️ THROW COMPLETED AIRPLANE AT YOUR BOSS
    </text>
  `;
}

/**
 * AI THAT MAKES THINGS WORSE
 */
export const AI_IMPROVERS = {
  enterprise(element) {
    element.name = `Boring_Corporate_Table`;
    element.width = 440;
    element.height = 280;
    element.backgroundColor = "#e2e8f0";
    element.textColor = "#0f172a";
    element.htmlContent = `
      <div style="font-family: Arial, sans-serif; font-size: 10px; color: #1e293b; padding: 10px; border: 2px solid #94a3b8; background: #f1f5f9; height: 100%;">
        <div style="background: #334155; color: white; padding: 4px 8px; font-weight: bold; margin-bottom: 6px;">
          BORING CORPORATE TABLE (LOTS OF NUMBERS)
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 9px; text-align: left;">
          <thead>
            <tr style="background: #cbd5e1; border-bottom: 2px solid #64748b;">
              <th style="padding: 3px;">Item</th>
              <th style="padding: 3px;">Growth</th>
              <th style="padding: 3px;">Status</th>
              <th style="padding: 3px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td>Money Lost</td><td>+340%</td><td>Bad</td>
              <td><button style="font-size: 8px; background: #cbd5e1; border: 1px solid #94a3b8;">Fix</button></td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td>Confusion Level</td><td>9,400 pts</td><td>High</td>
              <td><button style="font-size: 8px; background: #cbd5e1; border: 1px solid #94a3b8;">Help</button></td>
            </tr>
            <tr>
              <td>Meetings / Day</td><td>8</td><td>Tired</td>
              <td><button style="font-size: 8px; background: #cbd5e1; border: 1px solid #94a3b8;">Leave</button></td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top: 8px; font-size: 8px; color: #64748b;">
          *Needs 4 manager approvals before you can click anything.
        </div>
      </div>
    `;
  },

  crypto(element) {
    element.name = `Crypto_Mode_NFT`;
    element.width = 380;
    element.height = 240;
    element.backgroundColor = "#0d0221";
    element.textColor = "#00f0ff";
    element.htmlContent = `
      <div style="font-family: monospace; padding: 14px; background: radial-gradient(circle, #240046 0%, #0f051d 100%); border: 2px solid #00f0ff; box-shadow: 0 0 15px #00f0ff; height: 100%; color: #00f0ff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-weight: bold; color: #ff007f;">💎 FAKE NFT BUTTON</span>
          <span style="background: #ff007f; color: #fff; font-size: 8px; padding: 2px 4px; border-radius: 2px;">#8921</span>
        </div>
        <div style="font-size: 11px; margin-bottom: 10px; color: #fff;">
          Pay money to unlock this button:
        </div>
        <button style="width: 100%; padding: 8px; background: linear-gradient(90deg, #ff007f, #7928ca); border: none; color: #fff; font-weight: bold; font-size: 11px; cursor: pointer; border-radius: 4px; box-shadow: 0 0 10px rgba(255,0,127,0.5);">
          🦊 Connect Wallet (Gas: $4,800)
        </div>
        <div style="font-size: 8px; color: #888; margin-top: 10px; text-align: center;">
          ⚡ Warning: Money will disappear when you click.
        </div>
      </div>
    `;
  },

  agile(element) {
    element.name = `Blocked_Work_Ticket`;
    element.width = 340;
    element.height = 220;
    element.backgroundColor = "#fff";
    element.htmlContent = `
      <div style="font-family: sans-serif; padding: 12px; border: 2px solid #dc2626; background: #fef2f2; height: 100%; position: relative;">
        <div style="background: #dc2626; color: white; font-weight: bold; font-size: 11px; padding: 4px 8px; display: inline-block; border-radius: 3px; margin-bottom: 8px;">
          ⛔ TASK: FIG-666 [BLOCKED]
        </div>
        <div style="font-size: 12px; font-weight: bold; color: #991b1b; margin-bottom: 6px;">
          "Cannot click button until next year"
        </div>
        <div style="font-size: 9px; color: #b91c1c; line-height: 1.4;">
          Points: 99 • Status: Blocked Forever • Assignee: Nobody<br>
          Nobody knows how to fix this.
        </div>
        <div style="margin-top: 14px; display: flex; gap: 6px;">
          <span style="background: #fee2e2; border: 1px solid #f87171; color: #dc2626; font-size: 9px; padding: 2px 6px; border-radius: 10px;">Blocked</span>
          <span style="background: #fee2e2; border: 1px solid #f87171; color: #dc2626; font-size: 9px; padding: 2px 6px; border-radius: 10px;">Meeting</span>
        </div>
      </div>
    `;
  },

  pop(element) {
    element.name = `Bright_Ugly_Button`;
    element.backgroundColor = "#ffff00";
    element.textColor = "#ff007f";
    element.boxShadow = "25px 25px 0px #00ffff, -20px -20px 0px #ff007f";
    element.htmlContent = `
      <div style="font-family: 'Comic Sans MS', cursive; padding: 16px; font-size: 18px; font-weight: 900; text-align: center; color: #ff0000; text-shadow: 2px 2px 0 #ffff00, -2px -2px 0 #00ffff; height: 100%; display: flex; align-items: center; justify-content: center; transform: rotate(-3deg);">
        🔥 IS THIS BRIGHT ENOUGH YET?! 💥
      </div>
    `;
  }
};

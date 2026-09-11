/**
 * SENTIENT LAYERS MODULE
 * Layers have feelings and refuse selection until you say something nice.
 */

export const LAYER_MOODS = [
  {
    type: 'offended',
    label: 'Very Mad',
    emoji: '💔',
    complaints: [
      "You ignored me for 10 minutes. Are you ashamed of me?",
      "I saw you looking at the circle. Do you like it more than me?",
      "You dragged me onto the canvas and never touched me again.",
      "My size looks weird and you didn't even say sorry."
    ]
  },
  {
    type: 'sulking',
    label: 'Quiet & Grumpy',
    emoji: '😤',
    complaints: [
      "I don't feel like lining up with other boxes today.",
      "Don't click me. I need space right now.",
      "You changed my color without asking."
    ]
  },
  {
    type: 'vulnerable',
    label: 'Sad & Sensitive',
    emoji: '🥺',
    complaints: [
      "Do you really need me, or am I just useless?",
      "Please don't group me with other shapes. I get nervous.",
      "What if phone screens don't like me?"
    ]
  },
  {
    type: 'smug',
    label: 'Happy & Proud',
    emoji: '🥰',
    complaints: [
      "I am clearly the best box in this whole design.",
      "Look at my nice tilt. Very stylish."
    ]
  }
];

export class SentientLayerManager {
  constructor(onMoodChange, onPraiseSuccess) {
    this.onMoodChange = onMoodChange;
    this.onPraiseSuccess = onPraiseSuccess;
    this.activeTherapyLayer = null;
    this.modal = document.getElementById('modal-layer-therapy');
    this.setupListeners();
  }

  setupListeners() {
    if (!this.modal) return;

    // Praise buttons
    const praiseBtns = this.modal.querySelectorAll('.therapy-option-btn');
    praiseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const praiseType = btn.dataset.praise;
        this.applyPraise(praiseType);
      });
    });

    // Custom message input
    const submitBtn = document.getElementById('therapy-submit-custom');
    const inputField = document.getElementById('therapy-custom-text');
    if (submitBtn && inputField) {
      submitBtn.addEventListener('click', () => {
        if (inputField.value.trim()) {
          this.applyCustomPraise(inputField.value.trim());
          inputField.value = '';
        }
      });

      inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && inputField.value.trim()) {
          this.applyCustomPraise(inputField.value.trim());
          inputField.value = '';
        }
      });
    }
  }

  checkCanSelect(layer) {
    // If layer is upset and not yet flattered
    if (!layer.flattered) {
      this.openTherapyModal(layer);
      return false; // Blocks selection!
    }
    return true; // Allowed
  }

  openTherapyModal(layer) {
    this.activeTherapyLayer = layer;
    const mood = layer.mood || LAYER_MOODS[0];
    const quote = layer.complaint || mood.complaints[Math.floor(Math.random() * mood.complaints.length)];

    document.getElementById('therapy-layer-emoji').textContent = mood.emoji;
    document.getElementById('therapy-layer-name').textContent = `${layer.name} is upset`;
    document.getElementById('therapy-quote').textContent = `"${quote}"`;
    document.getElementById('therapy-mood-status').textContent = `Mood: ${mood.label} ${mood.emoji}`;

    this.modal.style.display = 'flex';
  }

  applyPraise(praiseType) {
    if (!this.activeTherapyLayer) return;

    const layer = this.activeTherapyLayer;
    layer.flattered = true;
    layer.mood = LAYER_MOODS[3]; // Happy & Proud

    document.getElementById('therapy-mood-status').textContent = "Mood: Happy now! 🥰";
    document.getElementById('therapy-quote').textContent = `"Thank you! That was very nice of you. You can edit me now."`;

    setTimeout(() => {
      this.modal.style.display = 'none';
      if (this.onPraiseSuccess) {
        this.onPraiseSuccess(layer);
      }
      this.activeTherapyLayer = null;
    }, 1100);
  }

  applyCustomPraise(text) {
    if (!this.activeTherapyLayer) return;

    const layer = this.activeTherapyLayer;
    layer.flattered = true;
    layer.mood = LAYER_MOODS[3]; // Happy

    document.getElementById('therapy-mood-status').textContent = "Mood: Feeling loved 🥹";
    document.getElementById('therapy-quote').textContent = `"Thank you for saying '${text}'. I will let you edit me now."`;

    setTimeout(() => {
      this.modal.style.display = 'none';
      if (this.onPraiseSuccess) {
        this.onPraiseSuccess(layer);
      }
      this.activeTherapyLayer = null;
    }, 1100);
  }
}

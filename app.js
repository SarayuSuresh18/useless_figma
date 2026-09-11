/**
 * USELESS FIGMA - MAIN APPLICATION CONTROLLER (SIMPLE ENGLISH)
 * Interactive replica of Figma equipped with anti-design features.
 */

import {
  MALAYALAM_COMMENTS,
  CLASHING_PALETTES,
  DESIGN_CRITIQUES,
  getAwkwardTilt,
  getAwkwardBorderRadius,
  getClashingColor,
  reshuffleVisualHierarchy
} from './anti-design.js';

import { PhysicsEngine } from './physics.js';
import { SentientLayerManager, LAYER_MOODS } from './sentient-layers.js';
import {
  textToMorse,
  MorseAudioPlayer,
  generateAsciiArt,
  generatePaperAirplaneSvg,
  AI_IMPROVERS
} from './nonsense.js';
import { ProductivityManager } from './productivity.js';
import { BadgeSystem } from './badges.js';

class UselessFigmaApp {
  constructor() {
    this.elements = [];
    this.selectedElementId = null;
    this.currentTool = 'select';
    this.zoomLevel = 1.0;
    this.panOffset = { x: 80, y: 60 };
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.isDraggingElement = false;
    this.dragStart = { x: 0, y: 0 };
    this.elementStartPos = { x: 0, y: 0 };

    // Auto-layout countdown
    this.autolayoutSeconds = 30;
    this.autolayoutInterval = null;

    // Version history
    this.versions = [
      { id: 'v0.1', name: 'v0.1 Empty Blank Canvas', data: [] },
      { id: 'v0.3', name: 'v0.3 The Ugliest Version', data: [] },
      { id: 'v1.0', name: 'v1.0 First Messy Box', data: [] }
    ];

    // Sticky notes on canvas
    this.stickyNotes = [];

    // DOM Elements
    this.viewport = document.getElementById('canvas-viewport');
    this.artboard = document.getElementById('canvas-artboard');
    this.elementsContainer = document.getElementById('elements-container');
    this.stickyNotesLayer = document.getElementById('sticky-notes-layer');
    this.selectionBox = document.getElementById('selection-box');
    this.selectionLabel = document.getElementById('selection-label');
    this.layerTree = document.getElementById('layer-tree');
    this.criticToast = document.getElementById('critic-toast');
    this.criticMessage = document.getElementById('critic-message');

    // Subsystems
    this.badgeSystem = new BadgeSystem((pts, delta, reason) => {
      this.showToast(`🔥 +${delta} Bad Design Points! ${reason}`);
    });

    this.morseAudio = new MorseAudioPlayer();

    this.physics = new PhysicsEngine(this.viewport, this.elementsContainer, (bodies) => {
      this.renderElements();
      this.updateSelectionBox();
    });

    this.sentientLayers = new SentientLayerManager(
      (layer) => this.renderLayerTree(),
      (layer) => {
        this.selectElement(layer.id, true);
        this.badgeSystem.addPoints(120, "Said something nice to an upset layer");
      }
    );

    this.productivity = new ProductivityManager((locked) => {
      if (locked) {
        this.showToast("🛑 Time for a break! Screen locked with calm elevator music.");
      }
    });

    this.initDefaultCanvas();
    this.setupEventListeners();
    this.setupAutoLayoutTimer();
    this.setupAutoPopComments();
    this.updateZoomDisplay();
    this.renderClashingSwatches();
  }

  // ==========================================
  // INITIAL CANVAS STATE
  // ==========================================
  initDefaultCanvas() {
    this.elements = [
      {
        id: 'el-frame-1',
        name: 'Bad Checkout Frame',
        type: 'frame',
        x: 120,
        y: 80,
        width: 320,
        height: 240,
        rotation: 8.4,
        backgroundColor: '#2b2b2b',
        textColor: '#ffffff',
        flattered: true,
        mood: LAYER_MOODS[3]
      },
      {
        id: 'el-btn-1',
        name: 'Unclickable Button',
        type: 'rectangle',
        x: 170,
        y: 190,
        width: 180,
        height: 48,
        rotation: -11.2,
        borderRadius: getAwkwardBorderRadius(),
        backgroundColor: '#00FF66',
        textColor: '#000000',
        flattered: false,
        mood: LAYER_MOODS[0],
        complaint: "You placed me inside this frame without asking!"
      },
      {
        id: 'el-circle-1',
        name: 'Crooked Circle',
        type: 'ellipse',
        x: 520,
        y: 130,
        width: 170,
        height: 120,
        rotation: 14.3,
        backgroundColor: '#FF007F',
        textColor: '#ffffff',
        flattered: false,
        mood: LAYER_MOODS[1],
        complaint: "I'm not a real circle and people don't like me."
      },
      {
        id: 'el-text-1',
        name: 'Warning Text',
        type: 'text',
        x: 150,
        y: 110,
        width: 220,
        height: 40,
        rotation: 4.8,
        backgroundColor: 'transparent',
        textColor: '#fbbf24',
        text: '⚠️ Do Not Click Anything',
        flattered: true,
        mood: LAYER_MOODS[3]
      }
    ];

    // Save baseline snapshot for cursed reversion
    this.versions[1].data = JSON.parse(JSON.stringify(this.elements));

    // Spawn 2 initial Malayalam sticky notes
    this.spawnMalayalamNote(280, 50, MALAYALAM_COMMENTS[0]);
    this.spawnMalayalamNote(540, 260, MALAYALAM_COMMENTS[1]);

    this.render();
  }

  // ==========================================
  // RENDERING ENGINE
  // ==========================================
  render() {
    this.renderElements();
    this.renderLayerTree();
    this.updateSelectionBox();
    this.updateInspectorProps();
  }

  renderElements() {
    this.elementsContainer.innerHTML = '';

    this.elements.forEach(el => {
      const div = document.createElement('div');
      div.className = `figma-element figma-${el.type}`;
      div.id = el.id;
      div.style.left = `${el.x}px`;
      div.style.top = `${el.y}px`;
      div.style.width = `${el.width}px`;
      div.style.height = `${el.height}px`;
      div.style.transform = `rotate(${el.rotation}deg)`;
      div.style.backgroundColor = el.backgroundColor || 'transparent';

      if (el.boxShadow) div.style.boxShadow = el.boxShadow;
      if (el.borderRadius) div.style.borderRadius = el.borderRadius;

      if (el.htmlContent) {
        div.innerHTML = el.htmlContent;
      } else if (el.type === 'frame') {
        const label = document.createElement('div');
        label.className = 'frame-label';
        label.textContent = el.name;
        div.appendChild(label);
      } else if (el.type === 'text') {
        div.textContent = el.text || el.name;
        div.style.color = el.textColor || '#fff';
      }

      // Element click to select
      div.addEventListener('mousedown', (e) => {
        if (this.currentTool === 'hand') return;
        e.stopPropagation();

        if (this.physics.active) {
          const rect = this.viewport.getBoundingClientRect();
          this.physics.startDrag(el.id, e.clientX - rect.left, e.clientY - rect.top);
          return;
        }

        // Check sentient layer approval!
        if (!this.sentientLayers.checkCanSelect(el)) {
          return;
        }

        this.selectElement(el.id);
        this.isDraggingElement = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
        this.elementStartPos = { x: el.x, y: el.y };
      });

      this.elementsContainer.appendChild(div);
    });
  }

  renderLayerTree() {
    this.layerTree.innerHTML = '';
    this.elements.slice().reverse().forEach(el => {
      const row = document.createElement('div');
      row.className = `layer-row ${el.id === this.selectedElementId ? 'selected' : ''}`;

      const icon = el.type === 'frame' ? '🔲' : el.type === 'ellipse' ? '⚪' : el.type === 'text' ? '🔤' : '▭';
      const mood = el.mood || LAYER_MOODS[0];
      const moodClass = el.flattered ? 'smug' : 'offended';

      row.innerHTML = `
        <div class="layer-title-wrap">
          <span class="layer-icon">${icon}</span>
          <span class="layer-name" title="${el.name}">${el.name}</span>
        </div>
        <div class="layer-mood-pill ${moodClass}" title="Click to soothe layer">
          <span>${mood.emoji}</span>
          <span>${el.flattered ? 'Happy' : 'Mad'}</span>
        </div>
      `;

      row.addEventListener('click', () => {
        if (!this.sentientLayers.checkCanSelect(el)) return;
        this.selectElement(el.id);
      });

      this.layerTree.appendChild(row);
    });
  }

  selectElement(id, skipTherapyCheck = false) {
    const el = this.elements.find(e => e.id === id);
    if (!el) return;

    if (!skipTherapyCheck && !this.sentientLayers.checkCanSelect(el)) {
      return;
    }

    this.selectedElementId = id;
    this.renderLayerTree();
    this.updateSelectionBox();
    this.updateInspectorProps();

    // Trigger random snarky critique toast
    this.randomCriticToast();
  }

  updateSelectionBox() {
    const selected = this.elements.find(e => e.id === this.selectedElementId);
    if (!selected || this.physics.active) {
      this.selectionBox.style.display = 'none';
      return;
    }

    this.selectionBox.style.display = 'block';
    this.selectionBox.style.left = `${selected.x}px`;
    this.selectionBox.style.top = `${selected.y}px`;
    this.selectionBox.style.width = `${selected.width}px`;
    this.selectionBox.style.height = `${selected.height}px`;
    this.selectionBox.style.transform = `rotate(${selected.rotation}deg)`;
    this.selectionLabel.textContent = `${selected.name} (${selected.rotation}°)`;
  }

  updateInspectorProps() {
    const selected = this.elements.find(e => e.id === this.selectedElementId);
    if (!selected) return;

    const propX = document.getElementById('prop-x');
    const propY = document.getElementById('prop-y');
    const propW = document.getElementById('prop-w');
    const propH = document.getElementById('prop-h');
    const propAngle = document.getElementById('prop-angle');
    const activeColorSwatch = document.getElementById('active-color-swatch');
    const colorHexDisplay = document.getElementById('color-hex-display');

    if (propX) propX.value = Math.round(selected.x);
    if (propY) propY.value = Math.round(selected.y);
    if (propW) propW.value = Math.round(selected.width);
    if (propH) propH.value = Math.round(selected.height);
    if (propAngle) propAngle.value = `${selected.rotation}° (Always Tilted)`;

    if (activeColorSwatch && selected.backgroundColor) {
      activeColorSwatch.style.backgroundColor = selected.backgroundColor;
    }
    if (colorHexDisplay && selected.backgroundColor) {
      colorHexDisplay.value = selected.backgroundColor;
    }
  }

  // ==========================================
  // EVENT LISTENERS & TOOLS
  // ==========================================
  setupEventListeners() {
    // Toolbar buttons
    const toolBtns = document.querySelectorAll('.tool-btn[data-tool]');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTool = btn.dataset.tool;

        if (this.currentTool === 'hand') {
          this.viewport.classList.add('hand-mode');
        } else {
          this.viewport.classList.remove('hand-mode');
        }

        if (this.currentTool === 'malayalam') {
          this.spawnMalayalamNote();
          btn.classList.remove('active');
          document.getElementById('tool-select').classList.add('active');
          this.currentTool = 'select';
        }
      });
    });

    // Gravity Toggle Button
    const gravityBtn = document.getElementById('tool-gravity');
    if (gravityBtn) {
      gravityBtn.addEventListener('click', () => {
        const isNowActive = !this.physics.active;
        if (isNowActive) {
          this.physics.enable(this.elements);
          gravityBtn.classList.add('active');
          gravityBtn.querySelector('.gravity-label').textContent = "Gravity: ON!";
          this.badgeSystem.addPoints(200, "Turned on falling physics");
          this.showToast("🪐 Gravity is on! Everything is falling down.");
        } else {
          this.physics.disable();
          gravityBtn.classList.remove('active');
          gravityBtn.querySelector('.gravity-label').textContent = "Gravity: OFF";
          this.showToast("🪐 Gravity stopped. Shapes are frozen where they fell.");
          this.render();
        }
      });
    }

    // Canvas click to spawn shapes (ALWAYS WEIRDLY TILTED)
    this.viewport.addEventListener('mousedown', (e) => {
      if (this.currentTool === 'hand' || e.button === 1 || e.spaceKey) {
        this.isPanning = true;
        this.panStart = { x: e.clientX - this.panOffset.x, y: e.clientY - this.panOffset.y };
        return;
      }

      if (e.target === this.viewport || e.target === this.elementsContainer || e.target === this.artboard) {
        const rect = this.elementsContainer.getBoundingClientRect();
        const spawnX = (e.clientX - rect.left) / this.zoomLevel;
        const spawnY = (e.clientY - rect.top) / this.zoomLevel;

        if (['rectangle', 'ellipse', 'frame', 'text'].includes(this.currentTool)) {
          this.createNewShape(this.currentTool, spawnX, spawnY);
          // Return to select
          document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
          document.getElementById('tool-select').classList.add('active');
          this.currentTool = 'select';
        } else {
          this.selectedElementId = null;
          this.updateSelectionBox();
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        this.panOffset.x = e.clientX - this.panStart.x;
        this.panOffset.y = e.clientY - this.panStart.y;
        this.applyCanvasTransform();
        return;
      }

      if (this.physics.active) {
        const rect = this.viewport.getBoundingClientRect();
        this.physics.drag(e.clientX - rect.left, e.clientY - rect.top);
        return;
      }

      if (this.isDraggingElement && this.selectedElementId) {
        const selected = this.elements.find(el => el.id === this.selectedElementId);
        if (selected) {
          const dx = (e.clientX - this.dragStart.x) / this.zoomLevel;
          const dy = (e.clientY - this.dragStart.y) / this.zoomLevel;
          selected.x = this.elementStartPos.x + dx;
          selected.y = this.elementStartPos.y + dy;

          const div = document.getElementById(selected.id);
          if (div) {
            div.style.left = `${selected.x}px`;
            div.style.top = `${selected.y}px`;
          }
          this.updateSelectionBox();
          this.updateInspectorProps();
        }
      }
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
      this.isDraggingElement = false;
      if (this.physics.active) {
        this.physics.stopDrag();
      }
    });

    // Zoom tool: ONLY ZOOMS OUT!
    this.setupZoomTool();

    // AI Ruin Dropdown Options
    this.setupAIImprovers();

    // Menu dropdown toggles
    this.setupDropdownMenus();

    // Cursed Export Modal
    this.setupExportModal();

    // Bottom HUD Buttons
    document.getElementById('btn-force-scramble')?.addEventListener('click', () => this.triggerAutoLayoutScramble());
    document.getElementById('btn-inspector-scramble')?.addEventListener('click', () => this.triggerAutoLayoutScramble());
    document.getElementById('btn-add-malayalam')?.addEventListener('click', () => this.spawnMalayalamNote());
    document.getElementById('btn-test-productivity')?.addEventListener('click', () => this.productivity.triggerLockout());

    // Rollback to ugliest version button
    document.getElementById('btn-revert-random')?.addEventListener('click', () => this.rollbackToUgliestVersion());
    document.getElementById('menu-revert-ugliest')?.addEventListener('click', () => this.rollbackToUgliestVersion());

    // Toast close
    document.getElementById('critic-close-btn')?.addEventListener('click', () => {
      this.criticToast.style.opacity = '0';
    });
  }

  // ==========================================
  // CREATING NEW TILTED SHAPES
  // ==========================================
  createNewShape(toolType, x, y) {
    const awkwardAngle = getAwkwardTilt();
    const clashingColor = getClashingColor();
    const id = `el-${Date.now()}`;
    let newElement = null;

    if (toolType === 'rectangle') {
      newElement = {
        id,
        name: `Tilted Rectangle ${this.elements.length + 1}`,
        type: 'rectangle',
        x: Math.round(x - 80),
        y: Math.round(y - 50),
        width: 170,
        height: 100,
        rotation: awkwardAngle,
        borderRadius: getAwkwardBorderRadius(),
        backgroundColor: clashingColor.hex,
        textColor: clashingColor.textColor,
        flattered: false,
        mood: LAYER_MOODS[Math.floor(Math.random() * 3)]
      };
    } else if (toolType === 'ellipse') {
      newElement = {
        id,
        name: `Crooked Circle ${this.elements.length + 1}`,
        type: 'ellipse',
        x: Math.round(x - 65),
        y: Math.round(y - 50),
        width: 140,
        height: 95,
        rotation: awkwardAngle,
        backgroundColor: clashingColor.hex,
        textColor: clashingColor.textColor,
        flattered: false,
        mood: LAYER_MOODS[Math.floor(Math.random() * 3)]
      };
    } else if (toolType === 'frame') {
      newElement = {
        id,
        name: `Tilted Frame ${this.elements.length + 1}`,
        type: 'frame',
        x: Math.round(x - 140),
        y: Math.round(y - 100),
        width: 280,
        height: 200,
        rotation: awkwardAngle,
        backgroundColor: '#262626',
        textColor: '#ffffff',
        flattered: false,
        mood: LAYER_MOODS[Math.floor(Math.random() * 3)]
      };
    } else if (toolType === 'text') {
      newElement = {
        id,
        name: `Ugly Text ${this.elements.length + 1}`,
        type: 'text',
        x: Math.round(x - 100),
        y: Math.round(y - 20),
        width: 200,
        height: 40,
        rotation: awkwardAngle,
        backgroundColor: 'transparent',
        textColor: clashingColor.hex,
        text: 'This font is not straight',
        flattered: false,
        mood: LAYER_MOODS[Math.floor(Math.random() * 3)]
      };
    }

    if (newElement) {
      this.elements.push(newElement);
      this.render();
      this.selectElement(newElement.id, true);
      this.badgeSystem.addPoints(50, `Drew a tilted ${toolType}`);
      this.showToast(`⚠️ Straight shapes are not allowed. Tilted by ${awkwardAngle}°.`);
    }
  }

  // ==========================================
  // THE ZOOM TOOL THAT ONLY ZOOMS OUT FOREVER
  // ==========================================
  setupZoomTool() {
    const zoomBtn = document.getElementById('zoom-toggle-btn');
    const zoomMenu = document.getElementById('zoom-menu');

    zoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      zoomMenu.classList.toggle('show');
    });

    document.getElementById('zoom-in-trick')?.addEventListener('click', () => {
      this.zoomOut();
      zoomMenu.classList.remove('show');
    });

    document.getElementById('zoom-out-action')?.addEventListener('click', () => {
      this.zoomOut(true);
      zoomMenu.classList.remove('show');
    });

    document.getElementById('zoom-void-action')?.addEventListener('click', () => {
      this.enterCosmicVoid();
      zoomMenu.classList.remove('show');
    });

    document.getElementById('zoom-reset-fail')?.addEventListener('click', () => {
      this.zoomOut();
      this.showToast("❌ Reset failed: canvas is lost.");
      zoomMenu.classList.remove('show');
    });

    document.getElementById('void-return-btn')?.addEventListener('click', () => {
      this.zoomLevel = 0.000001;
      this.updateZoomDisplay();
      this.showToast("🌌 Zoom failed: you zoomed out even more.");
    });

    // Invert wheel zoom: ANY direction zooms out!
    this.viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.zoomOut();
    }, { passive: false });
  }

  zoomOut(fast = false) {
    const factor = fast ? 0.45 : 0.75;
    this.zoomLevel = Math.max(0.00001, this.zoomLevel * factor);
    this.badgeSystem.addPoints(20, "Zoomed further out");
    this.updateZoomDisplay();
    this.applyCanvasTransform();

    if (this.zoomLevel < 0.08) {
      this.enterCosmicVoid();
    }
  }

  enterCosmicVoid() {
    this.zoomLevel = 0.00001;
    this.updateZoomDisplay();
    this.applyCanvasTransform();
    const voidEl = document.getElementById('cosmic-void');
    if (voidEl) voidEl.classList.add('visible');
    this.badgeSystem.addPoints(500, "Zoomed all the way out into space");
  }

  updateZoomDisplay() {
    const zoomText = document.getElementById('zoom-level-text');
    if (!zoomText) return;

    if (this.zoomLevel < 0.001) {
      zoomText.textContent = "0.00001% (Dot)";
    } else {
      zoomText.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }
  }

  applyCanvasTransform() {
    this.artboard.style.transform = `translate(${this.panOffset.x}px, ${this.panOffset.y}px) scale(${this.zoomLevel})`;
  }

  // ==========================================
  // AUTO-LAYOUT 30-SECOND SCRAMBLER
  // ==========================================
  setupAutoLayoutTimer() {
    const countdownEl = document.getElementById('autolayout-countdown');
    const progressBar = document.getElementById('autolayout-progress-bar');

    this.autolayoutInterval = setInterval(() => {
      this.autolayoutSeconds--;
      if (countdownEl) countdownEl.textContent = `Next Shuffle: ${this.autolayoutSeconds}s`;

      if (progressBar) {
        const pct = ((30 - this.autolayoutSeconds) / 30) * 100;
        progressBar.style.width = `${pct}%`;
      }

      if (this.autolayoutSeconds <= 0) {
        this.triggerAutoLayoutScramble();
        this.autolayoutSeconds = 30;
      }
    }, 1000);
  }

  triggerAutoLayoutScramble() {
    if (this.physics.active) return;

    reshuffleVisualHierarchy(this.elements);
    this.render();
    this.badgeSystem.addPoints(150, "Auto-layout shuffled your boxes");
    this.showToast("⚡ Auto-layout just shuffled your boxes!");
  }

  // ==========================================
  // MALAYALAM PASSIVE-AGGRESSIVE STICKY NOTES (POP-IN)
  // ==========================================
  spawnMalayalamNote(x = null, y = null, commentObj = null) {
    const comment = commentObj || MALAYALAM_COMMENTS[Math.floor(Math.random() * MALAYALAM_COMMENTS.length)];
    const id = `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const activeEl = this.elements.find(e => e.id === this.selectedElementId) || this.elements[0];
    let spawnX, spawnY;

    if (x !== null && y !== null) {
      spawnX = x;
      spawnY = y;
    } else if (activeEl) {
      spawnX = activeEl.x + (Math.random() * 40 - 10);
      spawnY = activeEl.y + (Math.random() * 40 - 10);
    } else {
      spawnX = Math.random() * 380 + 140;
      spawnY = Math.random() * 260 + 90;
    }

    const tilt = getAwkwardTilt();

    const note = {
      id,
      x: Math.max(30, Math.round(spawnX)),
      y: Math.max(30, Math.round(spawnY)),
      tilt,
      comment
    };

    this.stickyNotes.push(note);
    this.badgeSystem.addPoints(75, "Popped in a Malayalam comment");
    this.renderStickyNotes();
    this.showToast("📌 പുതിയ കമന്റ്: " + comment.malayalam.substring(0, 26) + "...");
  }

  renderStickyNotes() {
    this.stickyNotesLayer.innerHTML = '';
    this.stickyNotes.forEach(note => {
      const div = document.createElement('div');
      div.className = 'malayalam-note';
      div.id = note.id;
      div.style.left = `${note.x}px`;
      div.style.top = `${note.y}px`;
      div.style.backgroundColor = note.comment.color || '#ffe066';
      div.style.setProperty('--note-tilt', `${note.tilt}deg`);
      div.style.transform = `rotate(${note.tilt}deg)`;
      div.title = `English: "${note.comment.english}"`;

      div.innerHTML = `
        <button class="note-close-btn" title="Close note">&times;</button>
        <div class="malayalam-text">${note.comment.malayalam}</div>
        <div class="malayalam-sub">💬 "${note.comment.english}"</div>
      `;

      // Close button
      const closeBtn = div.querySelector('.note-close-btn');
      closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.stickyNotes = this.stickyNotes.filter(n => n.id !== note.id);
        div.style.transform = 'scale(0.2)';
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 160);
      });

      // Allow dragging notes manually
      div.addEventListener('mousedown', (e) => {
        if (e.target === closeBtn) return;
        e.stopPropagation();
        let startX = e.clientX;
        let startY = e.clientY;
        let noteStartX = note.x;
        let noteStartY = note.y;

        const onMove = (ev) => {
          note.x = noteStartX + (ev.clientX - startX);
          note.y = noteStartY + (ev.clientY - startY);
          div.style.left = `${note.x}px`;
          div.style.top = `${note.y}px`;
        };
        const onUp = () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      });

      this.stickyNotesLayer.appendChild(div);
    });
  }

  setupAutoPopComments() {
    setInterval(() => {
      if (this.elements.length > 0 && Math.random() > 0.4) {
        this.spawnMalayalamNote();
      }
    }, 28000);
  }

  // ==========================================
  // UGLY COLOR PICKER
  // ==========================================
  renderClashingSwatches() {
    const container = document.getElementById('clashing-swatches');
    if (!container) return;

    container.innerHTML = '';
    CLASHING_PALETTES.forEach(pal => {
      const swatch = document.createElement('div');
      swatch.className = 'curated-swatch';
      swatch.style.backgroundColor = pal.hex;
      swatch.title = `${pal.name} (${pal.hex})`;

      swatch.addEventListener('click', () => {
        const selected = this.elements.find(e => e.id === this.selectedElementId);
        if (selected) {
          selected.backgroundColor = pal.hex;
          selected.textColor = pal.textColor;
          this.render();
          this.badgeSystem.addPoints(100, `Used ugly color '${pal.name}'`);
          this.showToast(`🎨 Color changed to ${pal.name}.`);
        } else {
          this.showToast("Click a shape first to change its color.");
        }
      });

      container.appendChild(swatch);
    });
  }

  // ==========================================
  // AI THAT MAKES THINGS WORSE
  // ==========================================
  setupAIImprovers() {
    const aiBtn = document.getElementById('tool-ai');
    const aiMenu = document.getElementById('ai-menu');

    aiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      aiMenu.classList.toggle('show');
    });

    const runImprover = (type, label) => {
      aiMenu.classList.remove('show');
      const target = this.elements.find(e => e.id === this.selectedElementId) || this.elements[0];
      if (!target) return;

      if (AI_IMPROVERS[type]) {
        AI_IMPROVERS[type](target);
        this.render();
        this.badgeSystem.addPoints(250, `Used AI: ${label}`);
        this.showToast(`✨ AI has made it worse: ${label}`);
      }
    };

    document.getElementById('ai-enterprise')?.addEventListener('click', () => runImprover('enterprise', 'Make it Corporate'));
    document.getElementById('ai-crypto')?.addEventListener('click', () => runImprover('crypto', 'Crypto Mode'));
    document.getElementById('ai-agile')?.addEventListener('click', () => runImprover('agile', 'Work Mode'));
    document.getElementById('ai-pop')?.addEventListener('click', () => runImprover('pop', 'Make it POP'));
  }

  // ==========================================
  // BAD EXPORT MODAL
  // ==========================================
  setupExportModal() {
    const exportModal = document.getElementById('modal-cursed-export');
    const openMenuBtn = document.getElementById('menu-open-export');
    const closeBtn = document.getElementById('close-export-modal');

    openMenuBtn?.addEventListener('click', () => {
      document.getElementById('figma-menu').classList.remove('show');
      this.openExportModal();
    });

    closeBtn?.addEventListener('click', () => {
      exportModal.style.display = 'none';
    });

    const exportTabs = exportModal.querySelectorAll('.export-tab-btn');
    exportTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        exportTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const mode = tab.dataset.export;
        document.querySelectorAll('.export-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`export-tab-${mode}`)?.classList.add('active');
      });
    });

    // Morse Audio Beeper
    const playMorseBtn = document.getElementById('btn-play-morse');
    playMorseBtn?.addEventListener('click', () => {
      const morseCode = document.getElementById('morse-output').textContent;
      playMorseBtn.disabled = true;
      playMorseBtn.innerHTML = "<span>🔊 Playing Beeps...</span>";

      this.morseAudio.playMorse(morseCode.substring(0, 80), () => {
        playMorseBtn.disabled = false;
        playMorseBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          <span>Play Audio Beeps</span>
        `;
      });
    });

    // Copy & Download
    document.getElementById('btn-copy-morse')?.addEventListener('click', () => {
      navigator.clipboard.writeText(document.getElementById('morse-output').textContent);
      this.showToast("📡 Morse code copied to clipboard.");
    });

    document.getElementById('btn-copy-ascii')?.addEventListener('click', () => {
      navigator.clipboard.writeText(document.getElementById('ascii-output').textContent);
      this.showToast("📟 Text picture copied to clipboard.");
    });

    document.getElementById('btn-download-ascii')?.addEventListener('click', () => {
      const content = document.getElementById('ascii-output').textContent;
      const blob = new Blob([content], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'figma-text-picture.txt';
      a.click();
    });

    document.getElementById('btn-print-airplane')?.addEventListener('click', () => window.print());
  }

  openExportModal() {
    const modal = document.getElementById('modal-cursed-export');
    if (!modal) return;

    const docTitle = document.getElementById('document-title')?.textContent || "Untitled Lost";
    const rawSummary = `FIGMA ${docTitle} ITEMS: ` + this.elements.map(e => `${e.name} AT X${Math.round(e.x)} Y${Math.round(e.y)}`).join(" ");
    const morse = textToMorse(rawSummary);
    document.getElementById('morse-output').textContent = morse;

    const ascii = generateAsciiArt(this.elements, docTitle);
    document.getElementById('ascii-output').textContent = ascii;

    document.getElementById('airplane-svg').innerHTML = generatePaperAirplaneSvg();

    modal.style.display = 'flex';
  }

  // ==========================================
  // VERSION HISTORY
  // ==========================================
  rollbackToUgliestVersion() {
    const ugliest = this.versions[1].data;
    if (ugliest && ugliest.length > 0) {
      this.elements = JSON.parse(JSON.stringify(ugliest));
      this.render();
      this.badgeSystem.addPoints(100, "Went back to ugliest version");
      this.showToast("⏮️ Reverted back to the ugliest version.");
    }
  }

  // ==========================================
  // CRITIC TOAST
  // ==========================================
  randomCriticToast() {
    const critique = DESIGN_CRITIQUES[Math.floor(Math.random() * DESIGN_CRITIQUES.length)];
    this.criticMessage.textContent = `"${critique}"`;
    this.criticToast.style.opacity = '1';

    setTimeout(() => {
      this.criticToast.style.opacity = '0';
    }, 4500);
  }

  showToast(msg) {
    this.criticMessage.textContent = msg;
    this.criticToast.style.opacity = '1';
    setTimeout(() => {
      this.criticToast.style.opacity = '0';
    }, 4000);
  }

  setupDropdownMenus() {
    const menuBtn = document.getElementById('menu-toggle-btn');
    const menu = document.getElementById('figma-menu');
    menuBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    document.getElementById('menu-certificate')?.addEventListener('click', () => {
      menu.classList.remove('show');
      this.badgeSystem.openCertificate();
    });

    document.getElementById('menu-productivity')?.addEventListener('click', () => {
      menu.classList.remove('show');
      this.productivity.triggerLockout();
    });

    window.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));
    });
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.uselessFigma = new UselessFigmaApp();
});

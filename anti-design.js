/**
 * ANTI-DESIGN MODULE
 * Implements weirdly tilted shapes, 30s auto-layout reshuffler,
 * ugly color picker, and Malayalam sticky notes with simple English.
 */

export const MALAYALAM_COMMENTS = [
  {
    malayalam: "ഇതെന്തൊരു ഡിസൈൻ ആണ്? എന്റെ കൊച്ചുമോൻ ഇതിലും നന്നായി വരയ്ക്കും.",
    english: "What kind of design is this? My grandson draws better.",
    color: "#ffe066"
  },
  {
    malayalam: "ബട്ടൺ കുറച്ചുകൂടി വലുതാക്കാൻ വയ്യേ? ആളുകൾക്ക് കണ്ണുകാണില്ലെന്ന് വിചാരിച്ചോ?",
    english: "Can't you make the button bigger? Are users blind?",
    color: "#ffadad"
  },
  {
    malayalam: "ഇതാണോ യൂസർ എക്സ്പീരിയൻസ്? യൂസർ ഓടി രക്ഷപ്പെടും.",
    english: "Is this user experience? Users will just run away.",
    color: "#ffd6a5"
  },
  {
    malayalam: "വെറുതെ സമയം കളയാൻ വേണ്ടി ഓരോന്ന് ഉണ്ടാക്കിവെച്ചേക്കുന്നു.",
    english: "Just making random things to waste time at work.",
    color: "#caffbf"
  },
  {
    malayalam: "ഈ കളർ കണ്ടിട്ട് എനിക്ക് ഇപ്പോഴേ തലവേദന വരുന്നു.",
    english: "Looking at this color gives me a headache.",
    color: "#9bf6ff"
  },
  {
    malayalam: "അലൈൻമെന്റ് എങ്കിലും നേരെയാക്കിക്കൂടെ മനുഷ്യാ?",
    english: "Can't you at least line something up straight?",
    color: "#a0c4ff"
  },
  {
    malayalam: "ഇതൊക്കെ ആരെങ്കിലും ഉപയോഗിക്കുമോ അതോ വെറുതെ ഷോ കാണിക്കാൻ ഉണ്ടാക്കിയതാണോ?",
    english: "Will anyone actually use this, or is it just for show?",
    color: "#bdb2ff"
  },
  {
    malayalam: "ഫോണ്ട് സൈസ് 10px? ഞങ്ങൾ മൈക്രോസ്കോപ്പ് വെച്ച് വായിക്കണോ?",
    english: "Why is text so small? Should we bring a microscope?",
    color: "#ffc6ff"
  }
];

export const CLASHING_PALETTES = [
  { hex: "#00FF66", name: "Ugly Green", textColor: "#000" },
  { hex: "#FF007F", name: "Painful Pink", textColor: "#fff" },
  { hex: "#FFFF00", name: "Too Bright Yellow", textColor: "#000" },
  { hex: "#7B00FF", name: "Loud Purple", textColor: "#fff" },
  { hex: "#FF3300", name: "Warning Orange", textColor: "#fff" },
  { hex: "#00FFFF", name: "Old Web Blue", textColor: "#000" },
  { hex: "#7A5C00", name: "Mud Brown", textColor: "#fff" },
  { hex: "#FF80BF", name: "Soft Pink", textColor: "#000" },
  { hex: "#39FF14", name: "Neon Yellow-Green", textColor: "#000" },
  { hex: "#4B0082", name: "Dark Purple", textColor: "#fff" }
];

export const DESIGN_CRITIQUES = [
  "4px rounded corners? Very 2012.",
  "This shape is not straight at all.",
  "You spent 10 minutes centering this box.",
  "Did you mean to open Excel instead?",
  "This color is way too bright.",
  "Too much empty space here.",
  "Every box you draw gets tilted automatically.",
  "This font is very hard to read.",
  "Auto-layout will shuffle this soon anyway."
];

/**
 * Generates an awkward tilt angle that refuses to be straight.
 */
export function getAwkwardTilt() {
  const signs = [-1, 1];
  const sign = signs[Math.floor(Math.random() * signs.length)];
  const angle = (Math.random() * 11.5 + 5.3).toFixed(1);
  return sign * parseFloat(angle);
}

/**
 * Returns asymmetric corner radii to make any rectangle lopsided
 */
export function getAwkwardBorderRadius() {
  const r1 = Math.floor(Math.random() * 24 + 4);
  const r2 = Math.floor(Math.random() * 10 + 1);
  const r3 = Math.floor(Math.random() * 32 + 8);
  const r4 = Math.floor(Math.random() * 12 + 2);
  return `${r1}px ${r2}px ${r3}px ${r4}px`;
}

/**
 * Picks a clashing color
 */
export function getClashingColor(currentHex) {
  const filtered = CLASHING_PALETTES.filter(c => c.hex.toLowerCase() !== (currentHex || '').toLowerCase());
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/**
 * Auto-Layout 30-Second Reshuffler
 * Scrambles and reorganizes elements across canvas
 */
export function reshuffleVisualHierarchy(elements, containerWidth = 900, containerHeight = 600) {
  if (!elements || elements.length === 0) return;

  const strategies = ['spiral', 'diagonal-pile', 'staggered-chaos', 'perimeter-exile'];
  const strategy = strategies[Math.floor(Math.random() * strategies.length)];

  elements.forEach((el, index) => {
    let newX, newY, newAngle;

    switch (strategy) {
      case 'diagonal-pile':
        newX = 80 + index * 65 + (Math.random() * 40 - 20);
        newY = 60 + index * 55 + (Math.random() * 40 - 20);
        newAngle = getAwkwardTilt();
        break;

      case 'spiral':
        const theta = index * 1.2;
        const r = 40 + index * 55;
        newX = 380 + r * Math.cos(theta);
        newY = 280 + r * Math.sin(theta);
        newAngle = (theta * (180 / Math.PI) % 360).toFixed(1);
        break;

      case 'perimeter-exile':
        const corners = [
          { x: 50, y: 50 },
          { x: containerWidth - 250, y: 50 },
          { x: 50, y: containerHeight - 200 },
          { x: containerWidth - 250, y: containerHeight - 200 }
        ];
        const corner = corners[index % corners.length];
        newX = corner.x + (Math.random() * 60 - 30);
        newY = corner.y + (Math.random() * 60 - 30);
        newAngle = getAwkwardTilt();
        break;

      case 'staggered-chaos':
      default:
        newX = Math.random() * (containerWidth - 260) + 40;
        newY = Math.random() * (containerHeight - 220) + 40;
        newAngle = getAwkwardTilt();
        break;
    }

    el.x = Math.max(20, Math.min(newX, containerWidth - 100));
    el.y = Math.max(20, Math.min(newY, containerHeight - 100));
    el.rotation = newAngle;
  });
}

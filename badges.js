/**
 * BADGES & BAD DESIGNER SCORING MODULE (SIMPLE ENGLISH)
 * Awards points for confusing layouts, bad colors, and tilted shapes.
 */

export const RANKS = [
  { minPoints: 0, title: "Level 1: Beginner Mess Maker", nextReq: 500 },
  { minPoints: 500, title: "Level 2: Bad Color Expert", nextReq: 1500 },
  { minPoints: 1500, title: "Level 3: Confusing Layout Maker", nextReq: 3000 },
  { minPoints: 3000, title: "Level 4: Master of Bad UI", nextReq: 6000 },
  { minPoints: 6000, title: "Level 5: Chief Chaos Boss", nextReq: 99999 }
];

export class BadgeSystem {
  constructor(onScoreUpdate) {
    this.points = 650;
    this.onScoreUpdate = onScoreUpdate;

    this.scorePill = document.getElementById('chaos-score-badge');
    this.pointsText = document.getElementById('chaos-points');
    this.tierText = document.getElementById('chaos-tier');
    this.inspectorBadgeLevel = document.getElementById('inspector-badge-level');
    this.modal = document.getElementById('modal-certificate');

    this.setupListeners();
    this.render();
  }

  setupListeners() {
    // Open Certificate from badge pill or inspector button
    if (this.scorePill) {
      this.scorePill.addEventListener('click', () => this.openCertificate());
    }

    const inspectBtn = document.getElementById('btn-view-certificate');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => this.openCertificate());
    }

    const closeBtn = document.getElementById('close-cert-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.modal.style.display = 'none';
      });
    }

    const printBtn = document.getElementById('btn-print-cert');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }

    const bragBtn = document.getElementById('btn-brag-cert');
    if (bragBtn) {
      bragBtn.addEventListener('click', () => {
        alert("🎉 Link copied: 'I just reached Level 5 Bad Designer in Useless Figma!'");
      });
    }
  }

  addPoints(amount, reason = "") {
    this.points += amount;
    this.render();

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.points, amount, reason);
    }
  }

  getCurrentRank() {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (this.points >= RANKS[i].minPoints) {
        return RANKS[i];
      }
    }
    return RANKS[0];
  }

  render() {
    const rank = this.getCurrentRank();
    if (this.pointsText) this.pointsText.textContent = this.points;
    if (this.tierText) this.tierText.textContent = rank.title;
    if (this.inspectorBadgeLevel) this.inspectorBadgeLevel.textContent = `Rank: ${rank.title}`;

    const certScore = document.getElementById('cert-chaos-score');
    if (certScore) certScore.textContent = `${this.points} PTS`;
  }

  openCertificate() {
    if (this.modal) {
      this.modal.style.display = 'flex';
      this.render();
    }
  }
}

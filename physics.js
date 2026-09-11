/**
 * PHYSICS MODULE - GRAVITY MODE
 * Real-time 2D rigid-body simulation for falling frames and shapes.
 */

export class PhysicsEngine {
  constructor(canvasViewport, elementsContainer, onUpdate) {
    this.canvasViewport = canvasViewport;
    this.elementsContainer = elementsContainer;
    this.onUpdate = onUpdate;
    this.active = false;
    this.gravity = 0.55;
    this.friction = 0.985;
    this.restitution = 0.65; // bounce factor
    this.bodies = [];
    this.animationId = null;
    this.draggingBody = null;
    this.dragOffset = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.mouseVelocity = { vx: 0, vy: 0 };
  }

  enable(elements) {
    this.active = true;
    this.initBodies(elements);
    this.runLoop();
  }

  disable() {
    this.active = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  initBodies(elements) {
    this.bodies = elements.map(el => ({
      element: el,
      x: el.x,
      y: el.y,
      vx: (Math.random() * 4 - 2),
      vy: Math.random() * 2,
      rotation: parseFloat(el.rotation || 0),
      vRot: (Math.random() * 3 - 1.5),
      width: el.width || 160,
      height: el.height || 100,
      isDragging: false
    }));
  }

  runLoop() {
    if (!this.active) return;

    const floor = (this.canvasViewport.clientHeight || 700) - 120;
    const rightWall = (this.canvasViewport.clientWidth || 1000) - 80;

    this.bodies.forEach(b => {
      if (b.isDragging) return;

      // Apply gravity
      b.vy += this.gravity;
      b.vx *= this.friction;
      b.vRot *= this.friction;

      // Update positions
      b.x += b.vx;
      b.y += b.vy;
      b.rotation += b.vRot;

      // Floor collision & bounce
      if (b.y + b.height > floor) {
        b.y = floor - b.height;
        b.vy = -b.vy * this.restitution;
        b.vRot += (b.vx * 0.4); // rotation on impact

        // Small threshold to settle
        if (Math.abs(b.vy) < 1) {
          b.vy = 0;
        }
      }

      // Left and right boundary bounces
      if (b.x < 10) {
        b.x = 10;
        b.vx = -b.vx * this.restitution;
      } else if (b.x + b.width > rightWall) {
        b.x = rightWall - b.width;
        b.vx = -b.vx * this.restitution;
      }

      // Sync back to element data
      b.element.x = b.x;
      b.element.y = b.y;
      b.element.rotation = b.rotation;
    });

    if (this.onUpdate) {
      this.onUpdate(this.bodies);
    }

    this.animationId = requestAnimationFrame(() => this.runLoop());
  }

  startDrag(elementId, mouseX, mouseY) {
    if (!this.active) return;
    const body = this.bodies.find(b => b.element.id === elementId);
    if (!body) return;

    body.isDragging = true;
    this.draggingBody = body;
    this.dragOffset = { x: mouseX - body.x, y: mouseY - body.y };
    this.lastMousePos = { x: mouseX, y: mouseY };
  }

  drag(mouseX, mouseY) {
    if (!this.active || !this.draggingBody) return;

    this.mouseVelocity = {
      vx: (mouseX - this.lastMousePos.x) * 0.8,
      vy: (mouseY - this.lastMousePos.y) * 0.8
    };

    this.draggingBody.x = mouseX - this.dragOffset.x;
    this.draggingBody.y = mouseY - this.dragOffset.y;
    this.draggingBody.element.x = this.draggingBody.x;
    this.draggingBody.element.y = this.draggingBody.y;

    this.lastMousePos = { x: mouseX, y: mouseY };
  }

  stopDrag() {
    if (!this.draggingBody) return;
    this.draggingBody.vx = this.mouseVelocity.vx;
    this.draggingBody.vy = this.mouseVelocity.vy;
    this.draggingBody.vRot = (this.mouseVelocity.vx * 0.4);
    this.draggingBody.isDragging = false;
    this.draggingBody = null;
  }
}

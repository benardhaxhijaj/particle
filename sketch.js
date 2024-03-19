let particles = [];
const numParticles = 100;
const connectionThreshold = 150;
let targetX, targetY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(30, 30, 40);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  setRandomTarget();
}

function draw() {
  background(30, 30, 40);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update(targetX, targetY);
    particles[i].display();
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(
        particles[i].x,
        particles[i].y,
        particles[j].x,
        particles[j].y
      );
      if (d < connectionThreshold) {
        strokeWeight(map(d, 0, connectionThreshold, 2, 0.2));
        stroke(255, 255, 255, map(d, 0, connectionThreshold, 180, 0));
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
}

function setRandomTarget() {
  targetX = random(width);
  targetY = random(height);
  setTimeout(setRandomTarget, 5000);
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // Reduced velocity for slower movement
    this.vx = random(-0.01, 0.01);
    this.vy = random(-0.01, 0.01);
    this.radius = 8;
    this.color = color(255, 255, 255);
  }

  update(targetX, targetY) {
    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let angle = atan2(dy, dx);
    // Reduced force for more gentle movement
    let force = 0.001;
    this.vx += cos(angle) * force;
    this.vy += sin(angle) * force;

    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= width) {
      this.vx *= -0.9;
      this.x = constrain(this.x, 0, width);
    }
    if (this.y <= 0 || this.y >= height) {
      this.vy *= -0.9;
      this.y = constrain(this.y, 0, height);
    }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

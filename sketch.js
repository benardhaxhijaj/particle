let particles = [];
const numParticles = 100;
const connectionThreshold = 150;
let targetX, targetY;
let resetTimer = 0;
const resetInterval = 180000; // 3 minutes in milliseconds

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(30, 30, 40);
  initParticles();
  setRandomTarget();
}

function draw() {
  background(30, 30, 40);

  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update(targetX, targetY);
    particles[i].display();
  }

  // Draw connections between particles
  drawConnections();

  // Check if it's time to reset the particle system
  if (millis() - resetTimer > resetInterval) {
    resetParticles();
    resetTimer = millis(); // Reset the timer
  }
}

function initParticles() {
  particles = []; // Clear the existing particles array
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
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

function resetParticles() {
  // Fade out particles
  for (let particle of particles) {
    particle.fadeOut();
  }
  // Reinitialize particles after a short delay
  setTimeout(initParticles, 2000); // 2 seconds delay
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
    this.vx = random(-0.01, 0.01);
    this.vy = random(-0.01, 0.01);
    this.radius = 8;
    this.color = color(255, 255, 255);
    this.alpha = 255; // Add an alpha value for fading
  }

  update(targetX, targetY) {
    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let angle = atan2(dy, dx);
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

  fadeOut() {
    this.alpha -= 5; // Reduce alpha to fade out
    this.alpha = max(this.alpha, 0); // Ensure alpha doesn't go negative
  }

  display() {
    noStroke();
    fill(
      this.color.levels[0],
      this.color.levels[1],
      this.color.levels[2],
      this.alpha
    );
    ellipse(this.x, this.y, this.radius * 2);
  }
}

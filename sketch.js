let particles = [];
const numParticles = 2;
const connectionThreshold = 5;
let targetX, targetY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a gradient background
  setGradient(0, 0, width, height, color(25, 20, 20), color(80, 50, 50));
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  setRandomTarget();
}

function draw() {
  // Use the gradient background function within draw to allow for window resizing
  setGradient(
    0,
    0,
    width,
    height,
    color(25, 20, 20),
    color(80, 50, 50),
    Y_AXIS
  );

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
        stroke(
          lerpColor(
            color(255, 215, 0),
            color(255, 69, 0),
            d / connectionThreshold
          ),
          map(d, 0, connectionThreshold, 255, 0)
        );
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
}

function setRandomTarget() {
  targetX = random(width);
  targetY = random(height);
  setTimeout(setRandomTarget, 25000); // Change target every 30 seconds
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.05, 0.05);
    this.vy = random(-0.05, 0.05);
    this.radius = 11;
    // Add a glow effect
    this.color = color(255, 255, 255, 150);
  }

  update(targetX, targetY) {
    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let angle = atan2(dy, dx);
    let force = 0.001;
    this.vx += cos(angle) * force;
    this.vy += sin(angle) * force;

    // Repel particles when they get too close
    this.repellingForce();

    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > width) {
      this.vx *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.vy *= -1;
    }
  }

  repellingForce() {
    for (let other of particles) {
      let d = dist(this.x, this.y, other.x, other.y);
      if (other !== this && d < this.radius * 2) {
        let angle = atan2(this.y - other.y, this.x - other.x);
        this.vx += cos(angle) * 0.03;
        this.vy += sin(angle) * 0.03;
      }
    }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

// Function to create a gradient background
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

const Y_AXIS = 1;

let flock = [];
let sparkles = [];
let perceptionRadius = 50;
const numBoids = 45;
const maxSparkles = 80;

const themes = {
  dark: {
    boidColor: "166, 227, 161",
    boidTrailColor: "166, 227, 161",
    sparkleColors: ["255, 184, 108", "248, 248, 242", "189, 147, 249", "255, 121, 198"],
    backgroundColor: "15, 15, 26",
    backgroundAlpha: 75
  },
  light: {
    boidColor: "25, 100, 180",
    boidTrailColor: "80, 100, 140",
    sparkleColors: ["255, 85, 85", "80, 120, 180", "241, 140, 50", "128, 0, 128"],
    backgroundColor: "240, 240, 245",
    backgroundAlpha: 75
  },
  glass: {
    boidColor: "220, 220, 240",
    boidTrailColor: "210, 210, 255",
    sparkleColors: ["173, 216, 230", "255, 223, 186", "221, 160, 221", "144, 238, 144"],
    backgroundColor: "26, 26, 47",
    backgroundAlpha: 30
  }
};

let currentTheme = themes.dark;

class Point {
  constructor(x, y, userData) {
    this.x = x;
    this.y = y;
    this.userData = userData;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    );
  }

  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

class Quadtree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;

    let ne = new Rectangle(x + w, y - h, w, h);
    this.northeast = new Quadtree(ne, this.capacity);
    let nw = new Rectangle(x - w, y - h, w, h);
    this.northwest = new Quadtree(nw, this.capacity);
    let se = new Rectangle(x + w, y + h, w, h);
    this.southeast = new Quadtree(se, this.capacity);
    let sw = new Rectangle(x - w, y + h, w, h);
    this.southwest = new Quadtree(sw, this.capacity);

    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }

      return (
        this.northeast.insert(point) ||
        this.northwest.insert(point) ||
        this.southeast.insert(point) ||
        this.southwest.insert(point)
      );
    }
  }

  query(range, found) {
    if (!found) found = [];

    if (!this.boundary.intersects(range)) {
      return found;
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }
      if (this.divided) {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
      }
      return found;
    }
  }
}

class Sparkle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = random(1, 4);
    this.alpha = random(100, 255);
    this.decay = random(0.5, 2);
    this.color = random(currentTheme.sparkleColors);
    this.lifetime = random(20, 80);
    this.maxLifetime = this.lifetime;
  }

  update() {
    this.lifetime -= this.decay;
    this.alpha = map(this.lifetime, 0, this.maxLifetime, 0, 255);
  }

  display() {
    noStroke();
    let fadeRatio = this.lifetime / this.maxLifetime;
    let sparkleSize = this.size * fadeRatio;

    for (let i = 3; i > 0; i--) {
      fill(`rgba(${this.color}, ${this.alpha * 0.15 * i / 3})`);
      circle(this.position.x, this.position.y, sparkleSize * (4 - i));
    }

    fill(`rgba(${this.color}, ${this.alpha})`);
    circle(this.position.x, this.position.y, sparkleSize);
  }

  isDead() {
    return this.lifetime <= 0;
  }
}

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(2, 4));
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 2.5;
    this.maxForce = 0.12;
    this.trail = [];
    this.maxTrail = floor(random(3, 8));
    this.size = random(3, 5);
    this.brightness = random(0.7, 1.3);
  }

  edges() {
    const margin = 10;
    if (this.position.x > width + margin) this.position.x = -margin;
    if (this.position.x < -margin) this.position.x = width + margin;
    if (this.position.y > height + margin) this.position.y = -margin;
    if (this.position.y < -margin) this.position.y = height + margin;
  }

  alignment(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  seek(target) {
    if (!target) return createVector(0, 0);
    let desired = p5.Vector.sub(target, this.position);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce * 0.5);
    return steer;
  }

  flock(boids, mousePos) {
    let alignment = this.alignment(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);
    alignment.mult(1.0);
    cohesion.mult(0.8);
    separation.mult(1.5);
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
    if (mousePos && (abs(mouseX - pmouseX) > 1 || abs(mouseY - pmouseY) > 1)) {
      let seek = this.seek(mousePos);
      seek.mult(0.3);
      this.acceleration.add(seek);
      let d = dist(this.position.x, this.position.y, mousePos.x, mousePos.y);
      if (d < 80 && random() < 0.03 && sparkles.length < maxSparkles) {
        sparkles.push(new Sparkle(this.position.x, this.position.y));
      }
    }
  }

  updateTrail() {
    this.trail.push(createVector(this.position.x, this.position.y));
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }
  }

  update() {
    this.updateTrail();
    this.edges();
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
    if (random() < 0.003 * this.velocity.mag() && sparkles.length < maxSparkles) {
      sparkles.push(new Sparkle(this.position.x, this.position.y));
    }
  }

  display() {
    noFill();
    let trailColor = currentTheme.boidTrailColor || currentTheme.boidColor;
    if (this.trail.length > 1) {
      for (let i = 0; i < this.trail.length - 1; i++) {
        let alpha = map(i, 0, this.trail.length - 1, 10, 100) * this.brightness;
        let weight = map(i, 0, this.trail.length - 1, 0.5, this.size / 2);
        stroke(`rgba(${trailColor}, ${alpha / 100})`);
        strokeWeight(weight);
        line(this.trail[i].x, this.trail[i].y, this.trail[i + 1].x, this.trail[i + 1].y);
      }
    }
    let angle = this.velocity.heading();
    let boidColor = currentTheme.boidColor;
    noStroke();
    fill(`rgba(${boidColor}, 0.15)`);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    ellipse(0, 0, this.size * 4, this.size * 3);
    pop();
    fill(`rgba(${boidColor}, ${0.9 * this.brightness})`);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    beginShape();
    vertex(this.size * 1.5, 0);
    vertex(-this.size, this.size * 0.8);
    vertex(-this.size * 0.5, 0);
    vertex(-this.size, -this.size * 0.8);
    endShape(CLOSE);
    pop();
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("particles");
  resetFlock();
}

function resetFlock() {
  flock = [];
  for (let i = 0; i < numBoids; i++) {
    flock.push(new Boid(random(width), random(height)));
  }
}

function updateTheme(themeName) {
  if (themes[themeName]) {
    currentTheme = themes[themeName];
  }
}

window.addEventListener("themeChanged", (e) => {
  updateTheme(e.detail.theme);
});

function draw() {
  background(`rgba(${currentTheme.backgroundColor}, ${currentTheme.backgroundAlpha / 100})`);
  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  let qt = new Quadtree(boundary, 4);
  for (let boid of flock) {
    let point = new Point(boid.position.x, boid.position.y, boid);
    qt.insert(point);
  }
  let mousePosition = null;
  if (mouseIsPressed || (abs(mouseX - pmouseX) > 0 || abs(mouseY - pmouseY) > 0)) {
    mousePosition = createVector(mouseX, mouseY);
    if (random() < 0.2 && sparkles.length < maxSparkles) {
      sparkles.push(new Sparkle(mouseX + random(-10, 10), mouseY + random(-10, 10)));
    }
  }
  for (let boid of flock) {
    let range = new Rectangle(boid.position.x, boid.position.y, perceptionRadius, perceptionRadius);
    let points = qt.query(range);
    let nearbyBoids = points.map(p => p.userData);
    boid.flock(nearbyBoids, mousePosition);
    boid.update();
    boid.display();
  }
  for (let i = sparkles.length - 1; i >= 0; i--) {
    sparkles[i].update();
    sparkles[i].display();
    if (sparkles[i].isDead()) {
      sparkles.splice(i, 1);
    }
  }
  if (mousePosition) {
    let mouseActivity = min(dist(mouseX, mouseY, pmouseX, pmouseY) * 2, 100);
    if (mouseActivity > 5) {
      drawMouseGlow(mouseX, mouseY, mouseActivity);
    }
  }
}

function drawMouseGlow(x, y, intensity) {
  noStroke();
  let glowColor = random(currentTheme.sparkleColors);
  for (let i = 5; i > 0; i--) {
    let alpha = map(i, 0, 5, 0, 0.05 * intensity);
    fill(`rgba(${glowColor}, ${alpha})`);
    circle(x, y, intensity * (6 - i));
  }
}

function mousePressed() {
  for (let i = 0; i < 15; i++) {
    if (sparkles.length < maxSparkles) {
      let speed = random(1, 5);
      let angle = random(TWO_PI);
      let pos = createVector(mouseX + cos(angle) * random(5), mouseY + sin(angle) * random(5));
      sparkles.push(new Sparkle(pos.x, pos.y));
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
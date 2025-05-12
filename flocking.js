const NUM_BOIDS = 200;
const PERCEPTION_RADIUS = 60; 
const MAX_SPEED = 2.5;
const MAX_FORCE = 0.06;
const BOID_SIZE = 5;
const QUADTREE_CAPACITY = 4; 
const themes = {
  dark: {
    boidColor: [200, 220, 240, 140], // Soft blue-gray
    backgroundColor: [20, 20, 40],
    backgroundAlpha: 3
  },
  light: {
    boidColor: [220, 230, 245, 140], // Creamy white
    backgroundColor: [240, 245, 255],
    backgroundAlpha: 3
  },
  glass: {
    boidColor: [210, 200, 230, 140], // Pale lavender
    backgroundColor: [30, 30, 50],
    backgroundAlpha: 2
  }
};

let flock = [];
let currentTheme = themes.dark;
let forceClear = false;
let themeChangeTimeout = null;

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
    const { x, y, w, h } = this.boundary;
    this.northeast = new Quadtree(new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2), this.capacity);
    this.northwest = new Quadtree(new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2), this.capacity);
    this.southeast = new Quadtree(new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2), this.capacity);
    this.southwest = new Quadtree(new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2), this.capacity);
    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) return false;
    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }
    if (!this.divided) this.subdivide();
    return (
      this.northeast.insert(point) ||
      this.northwest.insert(point) ||
      this.southeast.insert(point) ||
      this.southwest.insert(point)
    );
  }

  query(range, found = []) {
    if (!this.boundary.intersects(range)) return found;
    for (let p of this.points) {
      if (range.contains(p)) found.push(p);
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

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(random(0.5, MAX_SPEED));
    this.acceleration = createVector();
    this.maxSpeed = MAX_SPEED;
    this.maxForce = MAX_FORCE;
  }

  avoidEdges() {
    let steering = createVector();
    const margin = 50;
    const turnForce = 0.05; // Reduced to prevent crowding
    if (this.position.x < margin) steering.x += turnForce;
    if (this.position.x > width - margin) steering.x -= turnForce;
    if (this.position.y < margin) steering.y += turnForce;
    if (this.position.y > height - margin) steering.y -= turnForce;
    return steering.limit(this.maxForce);
  }

  align(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      if (other !== this && this.position.dist(other.position) < PERCEPTION_RADIUS) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total).setMag(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
    }
    return steering;
  }

  cohere(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      if (other !== this && this.position.dist(other.position) < PERCEPTION_RADIUS) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total).sub(this.position).setMag(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
    }
    return steering;
  }

  separate(boids) {
    let steering = createVector();
    let total = 0;
    const minDistance = BOID_SIZE * 2; // Minimum distance to prevent overlap
    for (let other of boids) {
      let d = this.position.dist(other.position);
      if (other !== this && d < PERCEPTION_RADIUS && d > 0) {
        let diff = p5.Vector.sub(this.position, other.position);
        let scale = d < minDistance ? minDistance / d : 1; // Stronger repulsion if too close
        diff.div(d * d).mult(scale);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total).setMag(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    this.acceleration.set(0);
    this.acceleration.add(this.align(boids).mult(1.2));
    this.acceleration.add(this.cohere(boids).mult(1.6));
    this.acceleration.add(this.separate(boids).mult(1.5)); // Increased weight
    this.acceleration.add(this.avoidEdges());
  }

  update() {
    this.velocity.add(this.acceleration).limit(this.maxSpeed);
    this.position.add(this.velocity);
  }

  display() {
    noStroke();
    fill(...currentTheme.boidColor);
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading() + PI / 2);
    triangle(-BOID_SIZE / 2, -BOID_SIZE, BOID_SIZE / 2, -BOID_SIZE, 0, BOID_SIZE);
    pop();
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("particles");
  for (let i = 0; i < NUM_BOIDS; i++) {
    flock.push(new Boid(random(width), random(height)));
  }
}

function updateTheme(themeName) {
  if (themes[themeName]) {
    currentTheme = themes[themeName];
    forceClear = true;
  }
}

window.addEventListener("themeChanged", (e) => {
  if (themeChangeTimeout) clearTimeout(themeChangeTimeout);
  themeChangeTimeout = setTimeout(() => {
    updateTheme(e.detail.theme);
  }, 100);
});

function draw() {
  if (forceClear) {
    background(...currentTheme.backgroundColor, 255);
    forceClear = false;
  } else {
    background(...currentTheme.backgroundColor, currentTheme.backgroundAlpha);
  }

  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  let qt = new Quadtree(boundary, QUADTREE_CAPACITY);
  for (let boid of flock) {
    qt.insert(new Point(boid.position.x, boid.position.y, boid));
  }
  for (let boid of flock) {
    let range = new Rectangle(boid.position.x, boid.position.y, PERCEPTION_RADIUS, PERCEPTION_RADIUS);
    let nearby = qt.query(range).map(p => p.userData);
    boid.flock(nearby);
    boid.update();
    boid.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
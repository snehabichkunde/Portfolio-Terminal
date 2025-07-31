// --- CONFIGURATION (Tuned for a Professional Look) ---
const NUM_BOIDS = window.innerWidth <= 600 ? 20 : 100; // Reduced to 20 boids for mobile
const MAX_SPEED = 1.2;
const MAX_FORCE = 0.03;
const BOID_SIZE = 8; // Length of the line
const QUADTREE_CAPACITY = 4;

// Plexus Effect
const CONNECTION_RADIUS = 100;

// Aesthetics
const FADE_IN_DURATION = 180; // in frames (approx. 3 seconds)

const themes = {
  dark: {
    boidColor: [205, 214, 244],
    lineColor: [137, 180, 250],
    backgroundColor: [30, 30, 46],
    backgroundAlpha: 10
  },
  light: {
    boidColor: [88, 110, 117],
    lineColor: [38, 139, 210],
    backgroundColor: [253, 246, 227],
    backgroundAlpha: 15
  },
  glass: {
    boidColor: [230, 220, 245],
    lineColor: [200, 190, 220],
    backgroundColor: [30, 30, 50],
    backgroundAlpha: 8
  },
  matrix: {
    boidColor: [0, 255, 70],
    lineColor: [0, 180, 60],
    backgroundColor: [10, 10, 10],
    backgroundAlpha: 20,
    quadtreeColor: [0, 255, 70, 40] // Faint green for the quadtree lines
  },
  hello_kitty: {
    boidColor: [219, 112, 147],
    lineColor: [255, 182, 193],
    backgroundColor: [255, 240, 245],
    backgroundAlpha: 12
  }
};

let flock = [];
let currentTheme = themes.dark;
let forceClear = false;
let themeChangeTimeout = null;

// --- HELPER CLASSES (Quadtree, Point, Rectangle) ---
class Point {
  constructor(x, y, userData) { this.x = x; this.y = y; this.userData = userData; }
}

class Rectangle {
  constructor(x, y, w, h) { this.x = x; this.y = y; this.w = w; this.h = h; }
  contains(point) { return (point.x >= this.x - this.w && point.x <= this.x + this.w && point.y >= this.y - this.h && point.y <= this.y + this.h); }
  intersects(range) { return !(range.x - range.w > this.x + this.w || range.x + range.w < this.x - this.w || range.y - range.h > this.y + this.h || range.y + range.h < this.y - this.h); }
}

class Quadtree {
  constructor(boundary, capacity) {
    this.boundary = boundary; this.capacity = capacity; this.points = []; this.divided = false;
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
    if (this.points.length < this.capacity) { this.points.push(point); return true; }
    if (!this.divided) this.subdivide();
    return (this.northeast.insert(point) || this.northwest.insert(point) || this.southeast.insert(point) || this.southwest.insert(point));
  }
  query(range, found = []) {
    if (!this.boundary.intersects(range)) return found;
    for (let p of this.points) { if (range.contains(p)) found.push(p); }
    if (this.divided) { this.northwest.query(range, found); this.northeast.query(range, found); this.southwest.query(range, found); this.southeast.query(range, found); }
    return found;
  }
}

// --- CORE BOID CLASS ---
class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(random(0.5, MAX_SPEED));
    this.acceleration = createVector();
    this.life = 0;
  }
  
  avoidEdges() {
    let steering = createVector();
    const margin = 50; const turnForce = 0.05;
    if (this.position.x < margin) steering.x += turnForce;
    if (this.position.x > width - margin) steering.x -= turnForce;
    if (this.position.y < margin) steering.y += turnForce;
    if (this.position.y > height - margin) steering.y -= turnForce;
    return steering.limit(MAX_FORCE);
  }

  align(boids) {
    let steering = createVector(); let total = 0; const perception = 50;
    for (let other of boids) { if (other !== this && this.position.dist(other.position) < perception) { steering.add(other.velocity); total++; } }
    if (total > 0) { steering.div(total).setMag(MAX_SPEED).sub(this.velocity).limit(MAX_FORCE); }
    return steering;
  }

  cohere(boids) {
    let steering = createVector(); let total = 0; const perception = 50;
    for (let other of boids) { if (other !== this && this.position.dist(other.position) < perception) { steering.add(other.position); total++; } }
    if (total > 0) { steering.div(total).sub(this.position).setMag(MAX_SPEED).sub(this.velocity).limit(MAX_FORCE); }
    return steering;
  }

  separate(boids) {
    let steering = createVector(); let total = 0; const minDistance = 24;
    for (let other of boids) {
      let d = this.position.dist(other.position);
      if (other !== this && d < minDistance) { let diff = p5.Vector.sub(this.position, other.position); diff.div(d * d); steering.add(diff); total++; }
    }
    if (total > 0) { steering.div(total).setMag(MAX_SPEED).sub(this.velocity).limit(MAX_FORCE); }
    return steering;
  }
  
  flock(boids) {
    this.acceleration.set(0);
    this.acceleration.add(this.align(boids).mult(1.0));
    this.acceleration.add(this.cohere(boids).mult(1.0));
    this.acceleration.add(this.separate(boids).mult(1.5));
    this.acceleration.add(this.avoidEdges());
  }

  update() {
    this.velocity.add(this.acceleration).limit(MAX_SPEED);
    this.position.add(this.velocity);
    if (this.life < FADE_IN_DURATION) this.life++;
  }

  display(alpha) {
    strokeWeight(2);
    stroke(...currentTheme.boidColor, alpha);
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    line(0, 0, BOID_SIZE, 0);
    pop();
  }
}

// --- P5.JS MAIN FUNCTIONS ---
function showQuadtree(qt) {
  noFill();
  strokeWeight(1);
  stroke(...currentTheme.quadtreeColor);
  
  let { x, y, w, h } = qt.boundary;
  rectMode(CENTER);
  rect(x, y, w * 2, h * 2);

  if (qt.divided) {
    showQuadtree(qt.northeast);
    showQuadtree(qt.northwest);
    showQuadtree(qt.southeast);
    showQuadtree(qt.southwest);
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("particles");
  for (let i = 0; i < NUM_BOIDS; i++) { flock.push(new Boid(random(width), random(height))); }
  const savedTheme = localStorage.getItem("theme") || "dark";
  updateTheme(savedTheme);
}

function updateTheme(themeName) {
  if (themes[themeName] && themes[themeName] !== currentTheme) {
    currentTheme = themes[themeName];
    forceClear = true;
  }
}

window.addEventListener("themeChanged", (e) => {
  if (themeChangeTimeout) clearTimeout(themeChangeTimeout);
  themeChangeTimeout = setTimeout(() => { updateTheme(e.detail.theme); }, 100);
});

function draw() {
  if (forceClear) {
    background(...currentTheme.backgroundColor);
    forceClear = false;
  } else {
    background(...currentTheme.backgroundColor, currentTheme.backgroundAlpha);
  }

  let globalAlpha = map(flock[0]?.life || 0, 0, FADE_IN_DURATION, 0, 255, true);

  let qt = new Quadtree(new Rectangle(width / 2, height / 2, width / 2, height / 2), QUADTREE_CAPACITY);
  for (let boid of flock) { qt.insert(new Point(boid.position.x, boid.position.y, boid)); }
  
  if (currentTheme === themes.matrix) {
    showQuadtree(qt);
  }

  for (let boid of flock) {
    let range = new Rectangle(boid.position.x, boid.position.y, CONNECTION_RADIUS, CONNECTION_RADIUS);
    let nearby = qt.query(range).map(p => p.userData);
    
    if (currentTheme !== themes.matrix) {
      for(let other of nearby) {
          let d = boid.position.dist(other.position);
          if (d > 0 && d < CONNECTION_RADIUS) {
              let lineAlpha = map(d, 0, CONNECTION_RADIUS, 50, 0);
              stroke(...currentTheme.lineColor, lineAlpha * (globalAlpha / 255));
              strokeWeight(1);
              line(boid.position.x, boid.position.y, other.position.x, other.position.y);
          }
      }
    }
    
    boid.flock(nearby);
    boid.update();
    boid.display(globalAlpha);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  forceClear = true;
}
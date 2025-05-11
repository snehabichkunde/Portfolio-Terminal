let flock = [];
let perceptionRadius = 50;
const numBoids = 150;

const themes = {
  dark: {
    boidColor: "173, 216, 230",
    strokeColor: "255, 255, 255",
    backgroundColor: "15, 15, 26",
    backgroundAlpha: 30
  },
  light: {
    boidColor: "25, 100, 180",
    strokeColor: "200, 200, 200",
    backgroundColor: "240, 240, 245",
    backgroundAlpha: 30
  },
  glass: {
    boidColor: "220, 220, 240",
    strokeColor: "255, 255, 255",
    backgroundColor: "26, 26, 47",
    backgroundAlpha: 20
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

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(2, 4));
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 2;
    this.maxForce = 0.1;
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
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

  flock(boids) {
    let alignment = this.alignment(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.edges();
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.mult(0);
  }

  display() {
    let angle = this.velocity.heading();
    fill(currentTheme.boidColor + ", 200");
    stroke(currentTheme.strokeColor);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    beginShape();
    vertex(0, -6);
    vertex(-4, 6);
    vertex(4, 6);
    endShape(CLOSE);
    pop();
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("particles");
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
  for (let boid of flock) {
    let range = new Rectangle(boid.position.x, boid.position.y, perceptionRadius, perceptionRadius);
    let points = qt.query(range);
    let nearbyBoids = points.map(p => p.userData);
    boid.flock(nearbyBoids);
    boid.update();
    boid.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
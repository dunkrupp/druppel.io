// Generic (and simplified) implementation of a list
class List {
  contents = [];

  constructor(contents = []) {
    this.contents =  [...contents];
  }

  add(color) {
    this.contents.push(color);

    return this;
  }

  at(index) {
    return this.contents[index];
  }

  length() {
    return this.contents.length;
  }

  random() {
    return Math.floor(Math.random() * this.length());
  }

  sample() {
    return this.contents[this.random()];
  }

  update(index, value) {
    this.contents[index] = value

    return this
  }
}

// ?
const COLOR_TYPES = {
    'HEX': 'hex',
    'RGB': 'rgb'
  }

// Contains color related data
class Color {
  name = undefined;
  value = undefined;
  type = undefined;

  constructor({ name, value, type }) {
    this.validate(name, value, type);

    this.name = name;
    this.value = value;
    this.type = type;
  }

  validate(name, value, type) {
    if (typeof name !== 'string') {
      throw new TypeError(`Name must be a string, received: ${name}`);
    }
    if (typeof value !== 'string') {
      throw new TypeError(`Value must be a string, receivedL ${value}`);
    }
    //if (!this.TYPES.includes(type)) {
    //  throw new TypeError('Type must be "rgb" or "hex"');
    //}
  }
}

class Line {

}

// Basic [Point] class
// Contains two-dimensional coordinates, and velocities.
class Point {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;

  constructor({ x, y, vx, vy }) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }
}

// Float
class FloatingShape extends Point {
  color = undefined;
  shape = undefined;

  constructor({x, y, vx, vy, color, shape}) {
    super({ x, y, vx, vy });
    this.color = color;
    this.shape = shape;
  }
}

const colors = new List;
const points = new List;

const POINT_COUNT = 50;
const POINT_CONNECTION_DISTANCE_MAX = 400;
const POINT_CONNECTIONS_MAX = 4;

// Clean these generators up a bit, we should use a callback as a second argument to the List constructor.
//   i.e. const point = new List({ limit: 10 }, () => { return new Point() })
// populate colors
[
  { red: "#cc241d" },
  { yellow: "#d79921" },
  { blue: "#458588" },
  { green: "#8ec07c" },
  { white: "#e6d7cf" },
].forEach((color => {
  colors.add(
    new Color(
      {
        name: Object.keys(color)[0],
        value: Object.values(color)[0],
        type: COLOR_TYPES.HEX
      }
    )
  )
}));

function setup() {
  createCanvas(windowWidth, windowHeight)
    .parent('body');

  // Set our Floating circles.
  for (let i = 0; i < POINT_COUNT; i++) {
    const point = new FloatingShape({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      color: colors.sample(),
      shape: 'circle'
    });

    points.add(point);
  }
}

function draw() {
  background('#211f1e')

  for (let i = 0; i < points.length(); i++) {
    const p1 = points.at(i);

    // Draw the point
    fill(p1.color.value);
    ellipse(p1.x, p1.y, 5, 5);

    // Find the closest neighbors
    const neighbors = [];

    for (let j = 0; j < points.length(); j++) {
      if (i !== j) {
        const p2 = points.at(j);
        const distance = dist(p1.x, p1.y, p2.x, p2.y);
        neighbors.push({ point: p2, distance: distance });
      }
    }

    // Sort neighbors by distance
    neighbors.sort((a, b) => a.distance - b.distance);
    neighbors.sort(a => a.distance)

    // Draw lines to the closest neighbors (up to POINT_CONNECTIONS_MAX)
    //  - we should calculate the gradient between the two points once and 'stretch' it?
    for (let k = 0; k < Math.min(POINT_CONNECTIONS_MAX, neighbors.length); k++) {
      const neighbor = neighbors[k].point;
      const distance = neighbors[k].distance;

      if (distance < POINT_CONNECTION_DISTANCE_MAX) {
        const opacity = map(distance, 0, POINT_CONNECTION_DISTANCE_MAX, 255, 0);
        stroke(215, 153, 33, opacity); // line color
        line(p1.x, p1.y, neighbor.x, neighbor.y);
      }
    }

    // Update point position and bounce
    p1.x = (p1.x + p1.vx);
    p1.y = (p1.y + p1.vy);

    if (p1.x < 0 || p1.x > width) {
      p1.vx *= -1;
    }
    if (p1.y < 0 || p1.y > height) {
      p1.vy *= -1;
    }

    // update point
    points.update(i, p1)
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

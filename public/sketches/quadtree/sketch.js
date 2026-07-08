const params = {
  pointCount: 2000,
  clusterCount: 3,
  capacity: 1,
  animating: true,
};

const points = [];
let clusters = [];

class QT {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.pts = [];
    this.divided = false;
  }
  contains(pt) {
    return (
      pt.x >= this.x && pt.x < this.x + this.w &&
      pt.y >= this.y && pt.y < this.y + this.h
    );
  }
  insert(pt) {
    if (!this.contains(pt)) return false;
    if (!this.divided && (this.pts.length < params.capacity || this.w <= 1)) {
      this.pts.push(pt);
      return true;
    }
    if (!this.divided) this.subdivide();
    return (
      this.nw.insert(pt) || this.ne.insert(pt) ||
      this.sw.insert(pt) || this.se.insert(pt)
    );
  }
  subdivide() {
    const hw = this.w / 2;
    const hh = this.h / 2;
    this.nw = new QT(this.x, this.y, hw, hh);
    this.ne = new QT(this.x + hw, this.y, hw, hh);
    this.sw = new QT(this.x, this.y + hh, hw, hh);
    this.se = new QT(this.x + hw, this.y + hh, hw, hh);
    for (const pt of this.pts) {
      this.nw.insert(pt) || this.ne.insert(pt) ||
      this.sw.insert(pt) || this.se.insert(pt);
    }
    this.pts = [];
    this.divided = true;
  }
  draw() {
    if (!this.divided) return;
    const mx = this.x + this.w / 2;
    const my = this.y + this.h / 2;
    line(mx, this.y, mx, this.y + this.h);
    line(this.x, my, this.x + this.w, my);
    this.nw.draw();
    this.ne.draw();
    this.sw.draw();
    this.se.draw();
  }
}

function gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = random();
  while (v === 0) v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function regenerate() {
  const W = width;
  const H = height;
  const sigmaScale = Math.min(W, H) / 600;
  points.length = 0;
  clusters = Array.from({ length: params.clusterCount }, () => ({
    cx: random(W * 0.2, W * 0.8),
    cy: random(H * 0.2, H * 0.8),
    sigma: random(25, 90) * sigmaScale,
    weight: random(0.3, 1),
    phaseX: random(TAU),
    phaseY: random(TAU),
    speed: random(0.15, 0.35),
    amp: random(20, 60) * sigmaScale,
    x: 0,
    y: 0,
  }));
  const totalW = clusters.reduce((s, c) => s + c.weight, 0);

  for (let i = 0; i < params.pointCount; i++) {
    let r = random(totalW);
    let c = clusters[0];
    for (const cl of clusters) {
      r -= cl.weight;
      if (r <= 0) { c = cl; break; }
    }
    points.push({
      cluster: c,
      ox: gaussian() * c.sigma,
      oy: gaussian() * c.sigma,
      nx: random(1000),
      ny: random(1000),
      x: 0,
      y: 0,
    });
  }
  if (!isLooping()) redraw();
}

function setup() {
  createCanvas(windowWidth, windowHeight).parent('sketch');
  if (!params.animating) noLoop();
  regenerate();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  regenerate();
}

function draw() {
  background(0);
  strokeWeight(0.8);
  const t = frameCount / 60;

  for (const c of clusters) {
    c.x = c.cx + Math.sin(t * c.speed + c.phaseX) * c.amp;
    c.y = c.cy + Math.cos(t * c.speed * 1.3 + c.phaseY) * c.amp;
  }

  const qt = new QT(0, 0, width, height);
  for (const pt of points) {
    const wx = (noise(pt.nx, t * 0.25) - 0.5) * 10;
    const wy = (noise(pt.ny, t * 0.25) - 0.5) * 10;
    pt.x = constrain(pt.cluster.x + pt.ox + wx, 1, width - 1);
    pt.y = constrain(pt.cluster.y + pt.oy + wy, 1, height - 1);
    qt.insert(pt);
  }

  noFill();
  stroke(255, 80);
  qt.draw();

  noStroke();
  fill(255);
  for (const pt of points) {
    circle(pt.x, pt.y, 3);
  }
}

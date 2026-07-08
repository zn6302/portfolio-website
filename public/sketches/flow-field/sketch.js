const params = {
  particleCount: 5000,
  noiseScale: 0.003,
  speed: 0.45,
  fade: 19,
  gridSize: 35,
  vectorLen: 0.4,
  showVector: false,
};

const particles = [];

function spawn() {
  return { x: random(width), y: random(height) };
}

function resyncParticles() {
  while (particles.length < params.particleCount) particles.push(spawn());
  particles.length = params.particleCount;
}

function setup() {
  createCanvas(windowWidth, windowHeight).parent('sketch');
  background(0);
  noiseSeed(42);
  resyncParticles();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  noStroke();
  fill(0, params.fade);
  rect(0, 0, width, height);

  strokeWeight(0.5);
  const t = frameCount * 0.002;

  if (params.showVector) {
    stroke(255, 130);
    const gs = params.gridSize;
    const armLen = gs * params.vectorLen;
    for (let y = gs / 2; y < height; y += gs) {
      for (let x = gs / 2; x < width; x += gs) {
        const a = noise(x * params.noiseScale, y * params.noiseScale, t) * TAU * 2;
        line(x, y, x + Math.cos(a) * armLen, y + Math.sin(a) * armLen);
      }
    }
  }

  stroke(255);
  strokeWeight(2);

  for (const v of particles) {
    const angle = noise(v.x * params.noiseScale, v.y * params.noiseScale, t) * TAU * 2;
    v.x += Math.cos(angle) * params.speed;
    v.y += Math.sin(angle) * params.speed;
    if (v.x < 0 || v.x > width || v.y < 0 || v.y > height) {
      Object.assign(v, spawn());
    }
    point(v.x, v.y);
  }
}

const params = {
  lines: 119,
  amp: 100,
  noiseSeed: 500,
};

function setup() {
  createCanvas(windowWidth, windowHeight).parent('sketch');
  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function draw() {
  noiseSeed(params.noiseSeed);
  background(0);
  strokeWeight(1.2);

  const W = width;
  const H = height;
  const padding = Math.min(W, H) * 0.05;
  const availW = W - 2 * padding;
  const availH = H - 2 * padding;
  let boxW, boxH;
  if (availH / availW > 2) {
    boxW = availW;
    boxH = boxW * 2;
  } else {
    boxH = availH;
    boxW = boxH / 2;
  }
  const ox = (W - boxW) / 2;
  const oy = (H - boxH) / 2;

  const ampScale = boxH / 600;
  const amp = params.amp * ampScale;
  const left = ox;
  const right = ox + boxW;
  const lw = right - left;
  const top = oy + Math.max(40 * ampScale, amp * 1.5);
  const bottom = oy + boxH - 60 * ampScale;
  const lines = params.lines;

  for (let i = 0; i < lines; i++) {
    const y = top + (bottom - top) * (i / (lines - 1));
    const pts = [];
    const steps = 120;
    for (let s = 0; s <= steps; s++) {
      const tx = s / steps;
      const x = left + tx * lw;
      const env = Math.exp(-Math.pow((tx - 0.5) * 3.2, 2));
      const n =
        noise(tx * 3, i * 0.3) * 0.6 +
        noise(tx * 10, i * 0.7) * 0.3;
      const dy = -env * amp * (0.5 + n);
      pts.push([x, y + dy]);
    }

    noStroke();
    fill(0);
    beginShape();
    vertex(left, y);
    for (const [x, py] of pts) vertex(x, py);
    vertex(right, y);
    endShape(CLOSE);

    stroke(255);
    noFill();
    beginShape();
    for (const [x, py] of pts) vertex(x, py);
    endShape();
  }
}

let flowers = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	generateFlowers();
}

function generateFlowers() {
	flowers = [];

	let scale = min(width, height) / 600;
	let flowerCount = floor(50 * constrain(scale * scale, 1, 2.2));
	let maxX = width * 0.3;
	let maxY = height * 0.1;
	let goldenAngle = PI * (3 - sqrt(5));

	for (let i = 0; i < flowerCount; i++) {
		let spread = sqrt((i + 0.5) / flowerCount);
		let ang = i * goldenAngle;
		let jitter = 1 + random(-0.08, 0.08);
		let x = maxX * spread * cos(ang) * jitter;
		let y = maxY * spread * sin(ang) * jitter;

		let t = spread; // 離中心的比例：0=中心，1=邊緣
		let stemH = lerp(70 + random(30), 20 + random(20), t) * scale; // 中心高，邊緣矮
		let sz = lerp(8 + random(4), 4 + random(2), t) * scale;

		flowers.push(new Flower(width / 2 + x, height * 0.6 + y, sz, stemH));
	}
}

function draw() {
	background(245, 240, 230);
	drawSoil(width / 2, height * 0.6, width * 0.35, height * 0.15)

	for (let f of flowers) {
		f.update(mouseX, mouseY);
		f.display();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	generateFlowers();
}

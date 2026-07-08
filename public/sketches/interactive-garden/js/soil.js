function drawSoil(cx, cy, rx, ry) {
	// 外層土壤
	noStroke();
	fill("#DCD5C8");
	beginShape();
	for (let i = 0; i <= 48; i++) {
		let a = (i / 48) * TWO_PI;
		let rScale = map(noise(cos(a) * 1.5 + 5, sin(a) * 1.5 + 5), 0, 1, 0.8, 1.15); //r縮放係數
		splineVertex(cx + cos(a) * rx * rScale, cy + sin(a) * ry * rScale);
	}
	endShape(CLOSE);

	// 內層土壤
	fill("#CDC5B6");
	beginShape();
	for (let i = 0; i <= 48; i++) {
		let a = (i / 48) * TWO_PI;
		let rScale = map(noise(cos(a) * 1.5 + 5, sin(a) * 1.5 + 5), 0, 1, 0.8, 1.15); //r縮放係數
		splineVertex(cx + cos(a) * rx * rScale * 0.8, cy + sin(a) * ry * rScale * 0.8);
	}
	endShape(CLOSE);
}

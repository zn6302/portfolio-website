class Flower {

	constructor(x, y, size, stemH) {
		this.x = x;
		this.y = y - stemH; // 花的位置 = 莖頂端
		this.rootY = y; // 莖底部
		this.stemH = stemH;

		this.type = floor(random(6));
		this.centerR = random(size, size * 1.5);
		this.petalDist = random(size * 1.2, size * 2.5);
		this.petalW = random(size * 1.6, size * 4);
		this.petalH = random(size * 0.6, size * 1.2);
		this.petalCount = floor(random(5, 13));

		this.clr1 = random(PALETTES);
		this.clr2 = random(PALETTES.filter(c => c !== this.clr1));
		this.stemClr = random(stemPALETTES);
		this.rId = random();

		this.sway = 0; // 當前偏移量
		this.swayVel = 0; // 偏移速度
		this.mouseForce = 0; // 力

		// type 4 (spline 花) 用
		this.t = random(500, 45000);
		this.angFreq = random(2, 8);
		this.angAmp = random(0.05, 0.25);
		this.rFreq = random(2, 7);
		this.rAmp = random(0.05, 0.25);

		// type 5 (雲霧狀滿天星) 用：主枝向上散開，末端聚成小花雲
		this.babyBreathSprays = [];
		let sprayCount = 5 + floor(random(4));
		for (let i = 0; i < sprayCount; i++) {
			let fan = map(i, 0, max(1, sprayCount - 1), -1, 1) + random(-0.25, 0.25);
			let tipX = fan * this.centerR * random(2.4, 4.2);
			let tipY = -this.centerR * random(4.4, 7.2);
			let midX = tipX * random(0.25, 0.55) + random(-this.centerR * 0.5, this.centerR * 0.5);
			let midY = tipY * random(0.35, 0.65);
			let branches = [];
			let babyBranchCount = 5 + floor(random(4));

			for (let j = 0; j < babyBranchCount; j++) {
				let t = random(0.28, 0.95);
				let startX = bezierPoint(0, midX * 0.35, midX, tipX, t);
				let startY = bezierPoint(0, midY * 0.45, midY, tipY, t);
				let side = j % 2 === 0 ? -1 : 1;
				let branchAngle = -HALF_PI + fan * 0.45 + side * random(0.18, 0.7);
				let branchLen = this.centerR * random(0.9, 2.4) * map(t, 0.28, 0.95, 1.2, 0.65);
				let endX = startX + cos(branchAngle) * branchLen;
				let endY = startY + sin(branchAngle) * branchLen;
				let buds = [];
				let budCount = 2 + floor(random(4));

				for (let k = 0; k < budCount; k++) {
					let budA = random(TWO_PI);
					let budD = random(this.centerR * 0.05, this.centerR * 0.75);
					buds.push({
						x: endX + cos(budA) * budD,
						y: endY + sin(budA) * budD * 0.75,
						r: random(0.2, 0.48)
					});
				}

				branches.push({ startX, startY, endX, endY, buds });
			}

			let tipBuds = [];
			for (let k = 0; k < 5; k++) {
				let budA = random(TWO_PI);
				let budD = random(this.centerR * 0.1, this.centerR * 0.8);
				tipBuds.push({
					x: tipX + cos(budA) * budD,
					y: tipY + sin(budA) * budD * 0.7,
					r: random(0.24, 0.55)
				});
			}

			this.babyBreathSprays.push({ midX, midY, tipX, tipY, branches, tipBuds });
		}
	}

	display() {
		let topX = this.x + this.sway; // sway 已是最新值，放最前面

		this.displayStem(topX);

		push();
		translate(topX, this.y);
		stroke(this.clr1);
		fill(this.clr2);

		if (this.type == 0) {
			this.displayType0();
		} else if (this.type == 1) {
			this.displayType1();
		} else if (this.type == 2) {
			this.displayType2();
		} else if (this.type == 3) {
			this.displayType3();
		} else if (this.type == 4) {
			this.displayType4();
		} else if (this.type == 5) {
			this.displayType5();
		}

		pop();
	}

	displayStem(topX) {
		push();
		stroke(this.stemClr);
		strokeWeight(3);
		strokeCap(ROUND);
		noFill();

		let cp1x = this.x + this.sway * 0.15;
		let cp1y = this.rootY - this.stemH * 0.33;
		let cp2x = this.x + this.sway * 0.6;
		let cp2y = this.rootY - this.stemH * 0.66;
		bezier(this.x, this.rootY, cp1x, cp1y, cp2x, cp2y, topX, this.y);
		pop();
	}

	displayType0() { //<-------------第一種花
		for (let i = 0; i < this.petalCount; i++) {
			ellipse(this.petalDist, 0, this.petalW, this.petalH);
			rotate(TWO_PI / this.petalCount);
		}
		circle(0, 0, this.centerR);
		fill(255, 160);
		circle(0, 0, this.centerR / 2);
	}

	displayType1() { //<-------------第二種花
		for (let i = 0; i < this.petalCount; i++) {
			let a = (i / this.petalCount) * TWO_PI;
			circle(
				cos(a) * this.petalDist * 0.6,
				sin(a) * this.petalDist * 0.6,
				this.petalW * 0.5
			);
		}
		for (let i = 0; i < this.petalCount; i++) {
			let a = ((i + 0.5) / this.petalCount) * TWO_PI; //角度錯位
			circle(
				cos(a) * this.petalDist * 0.4,
				sin(a) * this.petalDist * 0.4,
				this.petalH
			);
		}

		noStroke();
		fill(this.clr1);
		circle(0, 0, this.centerR);
		fill(255, 255, 255, 180);
		circle(0, 0, this.centerR * 0.5);
	}

	displayType2() { //<-------------第三種花
		let pCount = floor(map(this.petalCount, 5, 12, 4, 7)) //想要花瓣少一點
		for (let i = 0; i < pCount; i++) {
			let a = (i / pCount) * TWO_PI;
			circle(
				cos(a) * this.centerR * 1.5,
				sin(a) * this.centerR * 1.5,
				this.centerR * 2.5
			);
		}
		circle(0, 0, this.centerR * 2);

		//花蕊
		strokeCap(ROUND);
		strokeWeight(2)
		strokeCap(ROUND);
		let lineCount = 14 + floor(this.rId * 5);

		for (let i = 0; i < lineCount; i++) {
			let a = (i / lineCount) * TWO_PI;
			let lengthMultiply = map(noise(i * 0.4 + this.centerR * 0.01), 0, 1, 1, 1.5)
			line(
				0, 0,
				cos(a) * this.centerR * lengthMultiply,
				sin(a) * this.centerR * lengthMultiply
			);
		}
	}

	displayType3() { //<-------------第四種花
		let lineCount = 12 + floor(this.rId * 8);
		for (let i = 0; i < lineCount; i++) {
			let a = (i / lineCount) * TWO_PI;
			line(
				0, 0,
				cos(a) * this.centerR * 2,
				sin(a) * this.centerR * 2
			);
			push()
			noStroke()
			fill(this.clr1);

			circle(
				cos(a) * this.centerR * 2,
				sin(a) * this.centerR * 2,
				this.centerR * 0.4)
			pop()
		}
		push()
		circle(0, 0, this.centerR * 1.5)
		noStroke()
		fill(this.clr1);
		circle(0, 0, this.centerR)
		pop()
	}

	displayType4() { //<-------------第五種花 (spline)
		let baseSize = this.centerR * 3;
		let evenR = sin(this.t / 1300) * baseSize;
		let oddR = sin(this.t / 1000 + PI) * baseSize;
		let tight = sin(this.t / 750) * 5;

		stroke(this.clr1);
		fill(this.clr2);
		strokeWeight(1);

		// 外瓣層
		beginShape();
		splineProperty('tightness', tight);
		for (let i = 0; i < 12; i++) {
			let baseAng = map(i, 0, 12, 0, TAU) + (i % 2 === 0 ? -this.t / 10000 : this.t / 10000);
			let baseR = i % 2 === 0 ? evenR : oddR;
			let ang = baseAng + sin(i * this.angFreq) * this.angAmp;
			let r = baseR * (1 + cos(i * this.rFreq) * this.rAmp);

			splineVertex(cos(ang) * r, sin(ang) * r);
		}
		endShape(CLOSE);

		// 內瓣層
		stroke(this.clr2);
		fill(this.clr1);
		beginShape();
		splineProperty('tightness', tight);
		for (let i = 0; i < 12; i++) {
			let baseAng = map(i, 0, 12, 0, TAU) + (i % 2 === 0 ? -this.t / 10000 : this.t / 10000);
			let baseR = i % 2 === 0 ? oddR : evenR;
			let ang = baseAng + sin(i * this.angFreq) * this.angAmp;
			let r = baseR * (1 + cos(i * this.rFreq) * this.rAmp);

			splineVertex(cos(ang) * r, sin(ang) * r);
		}
		endShape(CLOSE);

		// 花蕊
		noStroke();
		fill(255, 200);
		circle(0, 0, this.centerR * 0.08);
	}


	displayType5() { //<-------------第七種花（雲霧狀滿天星）
		strokeCap(ROUND);
		noFill();

		for (let spray of this.babyBreathSprays) {
			this.strokeWithAlpha(this.clr2, 190);
			strokeWeight(1);
			bezier(
				0, 0,
				spray.midX * 0.35, spray.midY * 0.45,
				spray.midX, spray.midY,
				spray.tipX, spray.tipY
			);

			for (let branch of spray.branches) {
				this.strokeWithAlpha(this.clr2, 180);
				strokeWeight(0.8);
				line(branch.startX, branch.startY, branch.endX, branch.endY);

				for (let bud of branch.buds) {
					this.displayBabyBreathBud(bud.x, bud.y, this.centerR * bud.r);
				}
			}

			for (let bud of spray.tipBuds) {
				this.displayBabyBreathBud(bud.x, bud.y, this.centerR * bud.r);
			}
		}

		noStroke();
		this.fillWithAlpha(this.clr1, 230);
		circle(0, -this.centerR * 0.2, this.centerR * 0.38);
	}

	displayBabyBreathBud(x, y, r) {
		noStroke();
		this.fillWithAlpha(this.clr1, 70);
		circle(x, y, r * 1.55);
		this.fillWithAlpha(this.clr2, 235);
		circle(x, y, r);
		this.fillWithAlpha(this.clr1, 145);
		circle(x - r * 0.12, y - r * 0.12, r * 0.45);
	}

	fillWithAlpha(baseColor, alpha) {
		fill(red(baseColor), green(baseColor), blue(baseColor), alpha);
	}

	strokeWithAlpha(baseColor, alpha) {
		stroke(red(baseColor), green(baseColor), blue(baseColor), alpha);
	}

	update(mx, my) {
		let dx = this.x + this.sway - mx;
		let d = dist(this.x + this.sway, this.y, mx, my);

		let mouseForce = 0;
		if (d < 90) { // 滑鼠距離花頂 90px 以內才有推力
			let dir = dx / (d + 1); // 推開方向，-1 到 1
			let strength = (1 - d / 90); // 越近越強，越遠越弱
			mouseForce = dir * strength;
		} else {
			this.mouseForce = 0;
		}

		this.swayVel += -this.sway * 0.12 + mouseForce * 2.5;
		this.swayVel *= 0.88;
		this.sway += this.swayVel;
	}

}

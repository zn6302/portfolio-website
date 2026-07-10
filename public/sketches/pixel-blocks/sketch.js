// let color_palette = ["#9DADBE", "#5D759A", "#222837", "#945031"];
// let basePalette = ["#78ade5", "#465365"];
let color_palette;
let basePalette;
let padding = 200;



async function setup() {
    createCanvas(2000, 1400); // 畫布大小：width, height

    let color_rand = random();
    // features setting
    if (color_rand < 0.167) { // "rusty blue"
        color_palette = ["#9DADBE", "#5D759A", "#222837", "#945031", "#945031", "#945031", "#945031", "#945031"];
        basePalette = ["#945031"];
    } else if (color_rand < 0.333) { // "blue"
        color_palette = ["#9DADBE", "#5D759A", "#222837", "#945031"];
        basePalette = ["#78ade5", "#465365"];
    } else if (color_rand < 0.5) { // "light blue"
        color_palette = ["#AACDEF", "#9DADBE", "#EDDBB3", "#5D759A", "#699BE5", "#DFDCD2"];
        basePalette = ["#78ade5", "#465365"];
    } else if (color_rand < 0.667) { // "warm terracotta / 暖陶土夕陽"
        color_palette = ["#C97B4A", "#8C4A3B", "#E8D5B5", "#3A3844", "#D98E5B"];
        basePalette = ["#C97B4A", "#3A3844"];
    } else if (color_rand < 0.833) { // "sage forest / 鼠尾草森林綠"
        color_palette = ["#8A9A82", "#4F5D4A", "#D9D4C0", "#2E3328", "#B5A98C"];
        basePalette = ["#8A9A82", "#2E3328"];
    } else { // "dusty mauve / 霧粉莫蘭迪"
        color_palette = ["#B98C8C", "#8C7385", "#E6D9CC", "#4A3F42", "#C9A9A6"];
        basePalette = ["#B98C8C", "#4A3F42"];
    }

    background(random(basePalette)); // 背景顏色
    colorMode(HSB);

    // 呼叫自己建立的函式
    // RJ_rect(100, 200, 10, 50, 10, 20, 5);

    let xsum = 0;
    // 使用迴圈繪製 - 底色層
    for (let i = 0; i < 20; i++) {
        let x = xsum;
        let y = 0;
        let xCount = int(random(5, 20));
        let yCount = 350;
        let R = 4;
        let xSpan = R + random(2, 5);
        let ySpan = R + random(3);

        RJ_rect(x, y, xCount, yCount, xSpan, ySpan, R);
        xsum += xCount * xSpan;
        await sleep(10);

    }

    // 使用迴圈重複繪製 - 中間層
    for (let i = 0; i < 200; i++) {
        let x = random(-padding, width);
        let y = random(-padding, height);
        let xCount = int(random(5, 20));
        let yCount = int(random(20, 200));
        let R = 4;
        let xSpan = R + random(2, 5);
        let ySpan = R + random(3);
        RJ_rect(x, y, xCount, yCount, xSpan, ySpan, R);
        await sleep(10);

    }

    // 只畫一次
    noLoop();
}


function draw() {}


// _x: 起始x座標, _y: 起始y座標, _xCount: x方向點點排數, _yCount: y方向點點排數, _xSpan: x方向間距, _ySpan: y方向間距, _R: 點點大小
function RJ_rect(_x, _y, _xCount, _yCount, _xSpan, _ySpan, _R) {

    let mainClr = random(color_palette); // 隨機選一個顏色
    let fade_scale = random(); // 0-1

    let mainHue = hue(mainClr);
    let mainSat = saturation(mainClr);
    let mainBri = brightness(mainClr);

    let lightClr = color(mainHue, mainSat - 10, mainBri + 50); // 將當前顏色調亮
    let waveScl = random();

    // 繪製點點矩陣
    for (let i = 0; i < _xCount; i++) {
        let px = i * _xSpan + _x; // 計算 x 座標
        for (let j = 0; j < _yCount; j++) {
            let py = j * _ySpan + _y; // 計算 y 座標

            let fade_rate = j / _yCount; // 0-1
            fade_rate = map(fade_rate, 0, 1, 0, fade_scale);

            if (random() > fade_rate) {
                push(); // 儲存畫布目前狀態
                translate(px, py); // 移動畫布原點

                fill(mainClr); // 填色

                // fill(lightClr);

                // 控制鐵皮摺痕方向與密度
                if (waveScl < 0.3) {
                    fill(abs(sin(px / 10)) < 0.3 ? lightClr : mainClr); // 畫出亮色線條
                } else if (waveScl < 0.7) {
                    fill(abs(sin(px / 5)) < 0.3 ? lightClr : mainClr); // 畫出亮色線條
                } else {
                    fill(abs(sin(px / 25)) < 0.3 ? lightClr : mainClr); // 畫出亮色線條
                }

                noStroke(); // 不要外框線
                let r = _R * random(0.8, 1.5) + random(0.6, 0.8);
                circle(0, 0, r); // 


      

                pop(); // 回復至畫布先前狀態




            }

        }
    }


}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

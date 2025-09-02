// Based on by Garrit Pixelkind

const size = 20;
const gap = 20;
let amount;
// Array to remember all the runes/symbols
let runes = [];

// rgb(12, 54, 10);
// rgb(1, 207, 94);

function setup() {
  createCanvas(innerWidth, innerHeight);
  windowResized();
  colorMode(RGB);
}

// Want to randomly offset positons (height) of each column

function drawElement(counter) {
  push();
  const fields = 4;
  const s = size / fields;
  const randomSeed = Math.random();
  scale(.8 + randomSeed);
  translate(Math.random() * 2, Math.random() * 2);
  for (let x = 0; x < fields; x++) {
    for (let y = 0; y < fields; y++) {
      push();
      noStroke();
      if (Math.random() < 0.5) {
        stroke(1, 207, 94, 255 * randomSeed - (100*Math.random()));
        strokeWeight(1.5 * randomSeed);
        fill(1, 255, 50 - random(1, 50), 255* randomSeed - (100*Math.random()));
      }
      square(x * s, y * s, s);
      pop();
    }
  }
  pop();
}

function draw() {
  background(0);
  noFill();
  strokeWeight(1);

  const centerX = (width - size) / 2;
  const centerY = (height - size) / 2;
  for (let x = -Math.floor(amount / 2); x < Math.ceil(amount / 2); x++) {
    for (let y = -Math.floor(amount / 2); y < Math.ceil(amount / 2); y++) {
      let xPosition = centerX + x * (size + gap);
      let yPosition = centerY + y * (size + gap);
      if (amount % 2 === 0) {
        xPosition += size / 2;
      }
      push();
      translate(xPosition, yPosition);
      drawElement(0);
      pop();
    }
  }

  noLoop();
}

function windowResized() {
  amount = Math.floor(max(width, height) / (size + gap));
  for (let i = 0; i < amount; i++) {
   runes.push(drawElement(0));
  }
  resizeCanvas(innerWidth, innerHeight);
  
}

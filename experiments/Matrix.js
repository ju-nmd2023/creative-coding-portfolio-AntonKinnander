// Based on by Garrit Pixelkind

const size = 20;
const gap = 20;
let amount;

function setup() {
  createCanvas(innerWidth, innerHeight);
  amount = Math.floor(max(width, height) / (size + gap));
}

function drawElement(counter) {
  push();
  const fields = 4;
  const s = size / fields;
  for (let x = 0; x < fields; x++) {
    for (let y = 0; y < fields; y++) {
      push();
      noStroke();
      if (Math.random() < 0.5) {
        fill(0, 0, 0);
      }
      square(x * s, y * s, s);
      pop();
    }
  }
  pop();
}

function draw() {
  background(255, 255, 255);
  noFill();
  stroke(0, 0, 0);
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
  resizeCanvas(innerWidth, innerHeight);
}

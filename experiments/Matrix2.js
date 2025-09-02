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

function drawElement(randomSeed, runePixels, x, y) {
  const fields = 4;
  const s = size / fields;
  scale(.8 + randomSeed);
  translate(randomSeed * 2, randomSeed * 2);

      push();
      for (let i = 0; i < 25; i++) {
        if (runePixels[i]) {
        stroke(1, 207, 94, 255 * randomSeed - (100*Math.random()));
        strokeWeight(1.5 * randomSeed);
        fill(1, 255, 50 - random(1, 50), 255* randomSeed - (100*Math.random()));
      }
      square(x * s, y * s, s);
      pop();
    }
}

function draw() {
  background(0);
  noFill();
  strokeWeight(1);

  
  for (let rune of runes) {
      push();
      scale(rune.scale);
      drawElement(rune.randomSeed, rune.runePixels, rune.x, rune.y);
      pop();
    }
  }


function windowResized() {
  const centerX = (width - size) / 2;
  const centerY = (height - size) / 2;
  runes = [];

  amount = Math.floor(max(width, height) / (size + gap));
  for (let x = -Math.floor(amount / 2); x < Math.ceil(amount / 2); x++) {
    for (let y = -Math.floor(amount / 2); y < Math.ceil(amount / 2); y++) {
    
   runes.push({
    x: centerX + x * (size + gap),
    y: centerY + y * (size + gap),
    scale: 0.5 + Math.random(),
    randomSeed: Math.random(),
    // set of 25 random values between determining if a pixel in the rune is visible (each rune is 5x5 so 25 pixels)
    runePixels: Array.from({length: 25}, () => Math.random() < 0.5),
  });
  }
}
  resizeCanvas(innerWidth, innerHeight);
  
}

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
  background(0);
}

// Want to randomly offset positons (height) of each column

function drawElement(randomSeed, runePixels, x, y) {
  push();
  translate(x, y);
  const fields = 5; // 5x5 grid for 25 pixels
  const s = size / fields;
  scale(.8 + randomSeed);
  translate(randomSeed * 2, randomSeed * 2);

  for (let i = 0; i < 25; i++) {
    if (runePixels[i]) {
      push();
      const gridX = i % 5; // column position (0-4)
      const gridY = Math.floor(i / 5); // row position (0-4)
      
      stroke(1, 207, 94, 255 * randomSeed - (100*Math.random()));
      strokeWeight(1.5 * randomSeed);
      fill(1, 255, 50 - random(1, 50), 255* randomSeed - (100*Math.random()));
      
      square(gridX * s, gridY * s, s);
      pop();
    }
  }
  pop();
}

function draw() {
  background(0,0,0,255);
  noFill();
  strokeWeight(1);

  
  for (let rune of runes) {
    if (rune.isVisible) {
      drawElement(rune.randomSeed, rune.runePixels, rune.x, rune.y);
      // times scale so the smaller ones (percieved in the back) move slower for parallax effect i think its called
      rune.y += 4 + 3 * rune.scale;
      // Very rarely redraw the rune to give even more matrixy effect
      if (Math.random() < 0.01) {
        rune.runePixels = Array.from({length: 25}, () => Math.random() < 0.5);
      }
      // reset postion to top after passing bottom in a random way
      if (rune.y > height + 25) {
        rune.y = -(250 + Math.random() * 200);
      }
    }
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
    // 50% chance completly invisible
    isVisible: Math.random() < 0.1,
  });
  }
}
  resizeCanvas(innerWidth, innerHeight);
  
}

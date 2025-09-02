let size;
const divider = 20;
const numRows = 60; // height
const numCols = 60; // width

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(198, 246, 200);
  fill(255, 200, 20);
  stroke(12, 54, 10);
  noStroke();
  noLoop();

  size = 1 + max(width, height) / numCols;
}

function draw() {
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const noiseValue = noise(x / divider, y / divider) * size;
      circle(x * size, y * size, noiseValue);
    }
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

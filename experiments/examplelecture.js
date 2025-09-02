function setup() {
  createCanvas(innerWidth, innerHeight);
  background(198, 246, 200);
  noFill();
  stroke(12, 54, 10);
  strokeWeight(3);
  noLoop();
}

function draw() {
  const yOrigin = height / 2;
  const divider = 40;
  noiseSeed(30);

  beginShape();
  for (let x = 0; x < width; x++) {
    const y = yOrigin + noise(x / divider) * 200;

    vertex(x, y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

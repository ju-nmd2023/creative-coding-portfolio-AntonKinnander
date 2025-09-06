// Recreation of Roni Kaufmans artwork featuring a grid of squares with a rotating rainbow spiral + square corner radius increasing and decreasing in the same spiral shape

// Key elements i need to replicate:
// 1. Grid of squares - square with full corner radius looks like a circle
// 2. Spiral pattern - use the mathematical function of a spiral? Then figure out what value i need to control to rotate it

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(34, 39, 46);
}

function draw() {
  background(34, 39, 46, 40);
  noStroke();
  fill(108, 182, 255);

  push();
  translate(width / 2, height / 2);

  push();
  rotate(frameCount / 8);
  ellipse(25, 0, 50);
  pop();

  push();
  rotate(-frameCount / 10);
  ellipse(75, 0, 50);
  pop();

  push();
  rotate(frameCount / 12);
  ellipse(125, 0, 50);
  pop();

  push();
  rotate(-frameCount / 14);
  ellipse(175, 0, 50);
  pop();

  pop();
}

// Recreation of Roni Kaufmans artwork featuring a grid of squares with a rotating rainbow spiral + square corner radius increasing and decreasing in the same spiral shape

// Key elements i need to replicate:
// 1. Grid of squares - square with full corner radius looks like a circle
// 2. Spiral pattern - use the mathematical function of a spiral? Then figure out what value i need to control to rotate it

const gap = 5;
let size;
const countPerRow = 7;

function setup() {
    createCanvas(innerWidth, innerHeight);
    windowResized();
    colorMode(RGB);
    background(250);
    rectMode(CENTER);
    noStroke();
    
  }

function draw() {
//  center canvas
// translate(-width / 2, -height / 2);
 
//  center drawing 
beginShape();
// translate(size * countPerRow + gap * (countPerRow - 1) / 2, size * countPerRow + gap * (countPerRow - 1) / 2);
 for (let x = 0; x < countPerRow; x++) {
    for (let y = 0; y < countPerRow; y++) {
        push();
        fill(255,60,60);
        translate(x * (size + (gap)), y * (size + (gap)));
        square(0, 0, size);
        pop();
    }
 }
}
endShape();

function windowResized() {
    resizeCanvas(innerWidth, innerHeight);
    size = min(width, height) / 12;
    clear();
  }

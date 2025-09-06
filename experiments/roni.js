// Recreation of Roni Kaufmans artwork featuring a grid of squares with a rotating rainbow spiral + square corner radius increasing and decreasing in the same spiral shape

// Key elements i need to replicate:
// 1. Grid of squares - square with full corner radius looks like a circle
// 2. Spiral pattern - use the mathematical function of a spiral? Then figure out what value i need to control to rotate it

const gap = 7.5;
let size;
const gridSize = 7;
let spiralFactor = .5;

function setup() {
    createCanvas(innerWidth, innerHeight);
    windowResized();
    colorMode(RGB);
    background(250);
    // rectMode(CENTER);
    noStroke();
    
  }

function draw() {
    const gridWidth = gridSize * size + (gridSize - 1) * gap;
    const gridHeight = gridSize * size + (gridSize - 1) * gap;
    
    // Center w/o translate
    const startX = (width - gridWidth) / 2;
    const startY = (height - gridHeight) / 2 - height/30;
    
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            push();
            fill(255, 60, 60);
            translate(startX + x * (size + gap), startY + y * (size + gap));
            
            square(0, 0, size, size * spiralFactor/(2));
            pop();
        }
    }
}

function windowResized() {
    resizeCanvas(innerWidth, innerHeight);
    size = min(width, height) / 12;
    clear();
    console.log(size, gap);
    //corner radius max value = size/2
  }

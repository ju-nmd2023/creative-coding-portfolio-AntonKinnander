// Recreation of Roni Kaufmans artwork Digital Impressionism featuring rectangles that are placed along flowfields looking a little like a RGB dispplay upclose 
// FIrst recreation without the particles being animated

const red = [255, 0, 0];
const green = [0, 255, 0];
const blue = [0, 0, 255];

function setup() {
    createCanvas(innerWidth, innerHeight);
    windowResized();
    colorMode(RGB);
    background(255);
    // rectMode(CENTER);
    noStroke();
    
  }

function draw() {

}

function windowResized() {
    resizeCanvas(innerWidth, innerHeight);
    clear();
  }

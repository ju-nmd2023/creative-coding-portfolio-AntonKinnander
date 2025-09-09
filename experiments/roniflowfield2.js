// Recreation of Roni Kaufmans artwork Digital Impressionism featuring rectangles that are placed along flowfields looking a little like a RGB dispplay upclose
// Now i will animate the particles / they get drawn in aLSO TRY TO MAKE THEEM overlap like the original
//Also used this tutorial https://dev.to/nyxtom/flow-fields-and-noise-algorithms-with-p5-js-5g67

//store the particles
let particles = [[], [], []];
const red = [255, 0, 0];
const green = [0, 255, 0];
const blue = [0, 0, 255];
const colors = [red, green, blue];

const spacing = 12;
const lineLength = 12;
const noiseScale = 0.01; //for the perlin noise

// Canvas area dimensions
let canvasAreaWidth;
let canvasAreaHeight;
let canvasAreaX;
let canvasAreaY;

function setup() {
  createCanvas(innerWidth, innerHeight); 
  background(0);
  strokeCap(SQUARE);
  strokeWeight(3);
  
  // Calculate canvas area dimensions
  canvasAreaWidth = width/3;
  canvasAreaHeight = canvasAreaWidth * (9/16);
  canvasAreaX = (width - canvasAreaWidth) / 2;
  canvasAreaY = (height - canvasAreaHeight) / 2;
}

function draw() {
  let newPixel;
  let nothingAdded = true;
  
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 3; j++) {
      stroke(colors[j]);
      
     
      newPixel = createVector(
        random(canvasAreaX + spacing/2, canvasAreaX + canvasAreaWidth - spacing/2), 
        random(canvasAreaY + spacing/2, canvasAreaY + canvasAreaHeight - spacing/2)
      );
      
      if (checkSpace(newPixel, particles[j])) {
        nothingAdded = false;
        particles[j].push(newPixel);
        
        // Calculate angle using noise
        const angle = noise(newPixel.x * noiseScale, newPixel.y * noiseScale) * TWO_PI * 2;
        
        // Calculate start and end points
        const x1 = newPixel.x - (lineLength / 2) * cos(angle);
        const y1 = newPixel.y - (lineLength / 2) * sin(angle);
        const x2 = newPixel.x + (lineLength / 2) * cos(angle);
        const y2 = newPixel.y + (lineLength / 2) * sin(angle);
        
        line(x1, y1, x2, y2);
      }
    }
  }
  
  if (nothingAdded) noLoop();
}

//Function to not overcrowd with pixels
function checkSpace(newPixel, pixelArray) {
  for (let pixel of pixelArray) {
    if (pixel.dist(newPixel) < spacing) {
      return false;
    }
  }
  return true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Reset particles and recalculate canvas area
  particles = [[], [], []];
  canvasAreaWidth = width/3;
  canvasAreaHeight = canvasAreaWidth * (9/16);
  canvasAreaX = (width - canvasAreaWidth) / 2;
  canvasAreaY = (height - canvasAreaHeight) / 2;
  
  background(0);
  loop(); // Restart the animation
}
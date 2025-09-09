// Recreation of Roni Kaufmans artwork Digital Impressionism featuring rectangles that are placed along flowfields looking a little like a RGB dispplay upclose
// FIrst recreation without the particles being animated

const red = [255, 0, 0];
const green = [0, 255, 0];
const blue = [0, 0, 255];

const spacing = 12;
const lineLength = 12;
const noiseScale = 0.005; //for the perlin nouse

function setup() {
  createCanvas(innerWidth, innerHeight); 
  background(0);

  //Canvas size
  const w = width/3;
  const h = w * (9/16);
  const x = (width - w) / 2;
  const y = (height - h) / 2;

  //Center
  translate(x, y);
 
  for (let y = 0; y < h; y += spacing * (1 + Math.random())) { 
    for (let x = 0; x < w; x += spacing * (1 + Math.random())) {
      

      const color = random([red, green, blue]);
      stroke(color);
      strokeWeight(3);
      strokeCap(SQUARE);

      const angle = noise(x * noiseScale, y * noiseScale) * TWO_PI * 2;

      // Calculate start and end points
      const x1 = x - (lineLength / 2) * cos(angle);
      const y1 = y - (lineLength / 2) * sin(angle);
      const x2 = x + (lineLength / 2) * cos(angle);
      const y2 = y + (lineLength / 2) * sin(angle);

      line(x1, y1, x2, y2);
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}
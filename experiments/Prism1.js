// Recreation of this prsim type art made by Tezumie using P5.js https://www.reddit.com/r/generative/comments/1n51jga/sketch_made_with_p5js/?show=original 
// with help from this video for gradients
// and this article to learn triangle subdivision  - https://www.tylerxhobbs.com/words/aesthetically-pleasing-triangle-subdivision

// Basically im starting with a square and dividing it into triangles then those into further smaller randomness but with randomness for where the points get placed. 
//Point d is always 0.5 so it doesnt get to crazy


const m = 10; //margin
const depthLimit= 6; // subdivision levels
const dividePoint = 0.6; // 0.5 makes it perfect, other values introduce randomness > 0.5 - smaller triangles to sides, < 0.5 - larger triangles to sides

let triangles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Makes stroke sharper
  stroke(0);
  strokeWeight(1);
  noFill();

  generateTriangles();
}

function draw() {
  background(255); 

  const scaleFactor = Math.min((width - 2 * m) / 2, (height - 2 * m) / 2);
  
  // Debug info
  console.log(`Canvas: ${width}x${height}, Scale: ${scaleFactor}, Triangles: ${triangles.length}`);

  push();
  translate(width / 2, height / 2);
  scale(1, -1);

  for (const triangle of triangles) {
    triangle.draw(scaleFactor);
  }
  pop();
}

// Add a function to manually trigger redraw for testing
function keyPressed() {
  if (key === ' ') {
    redraw();
  }
}

class Triangle {
  constructor(side1, side2, side3) {
    this.side1 = side1;
    this.side2 = side2;
    this.side3 = side3;
  }

  draw(scale) {
    const [x1, y1] = this.screen(this.side1, scale);
    const [x2, y2] = this.screen(this.side2, scale);
    const [x3, y3] = this.screen(this.side3, scale);

    triangle(x1, y1, x2, y2, x3, y3);
  }

  screen([width, height], scale) {
    return [width * scale, height * scale];
  }

  subdivide() {
    const { pointA, pointB, opposite } = longestSideWithOpposite(
      this.side1,
      this.side2,
      this.side3
    );
    const splitPoint = lerpPoints(pointA, pointB, dividePoint);

    const child1 = new Triangle(splitPoint, opposite, pointA, this.depth + 1);
    const child2 = new Triangle(splitPoint, opposite, pointB, this.depth + 1);

    return [child1, child2];
  }
}

// to make the math🤮 easier i scale this up but use 1 as the base unit
function generateTriangles() {
  triangles = [];

  const triangle1 = new Triangle([-1, 1], [1, 1], [-1, -1], 0);
  const triangle2 = new Triangle([1, -1], [-1, -1], [1, 1], 0);

  grow(triangle1, 0);
  grow(triangle2, 0);
}

function grow(triangle, depth) {
  if (depth >= depthLimit) {
    triangles.push(triangle);
    return;
  }
  const [child1, child2] = triangle.subdivide();
  grow(child1, depth + 1);
  grow(child2, depth + 1);
}

function distanceSquared(pointA, pointB) {
  const deltaX = pointA[0] - pointB[0];
  const deltaY = pointA[1] - pointB[1];
  return deltaX * deltaX + deltaY * deltaY;
}

// Gets the longest side of a triangle and returns its two points along with the opposite point in 
// order to split the triangle into two smaller triangles
function longestSideWithOpposite(side1, side2, side3) {
  const distance12 = distanceSquared(side1, side2);
  const distance23 = distanceSquared(side2, side3);
  const distance31 = distanceSquared(side3, side1);

  if (distance12 >= distance23 && distance12 >= distance31) {
    return { pointA: side1, pointB: side2, opposite: side3 };
  } else if (distance23 >= distance12 && distance23 >= distance31) {
    return { pointA: side2, pointB: side3, opposite: side1 };
  } else {
    return { pointA: side3, pointB: side1, opposite: side2 };
  }
}

// Calculates a point between pointA and pointB based on interpolation value (0 = pointA, 1 = pointB)
function lerpPoints(pointA, pointB, interpolation) {
  return [pointA[0] + (pointB[0] - pointA[0]) * interpolation, pointA[1] + (pointB[1] - pointA[1]) * interpolation];
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
  draw();
}
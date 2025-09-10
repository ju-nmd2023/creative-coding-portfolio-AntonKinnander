// Recreation of this prsim type art made by Tezumie using P5.js https://www.reddit.com/r/generative/comments/1n51jga/sketch_made_with_p5js/?show=original 
// with help from this video for gradients https://www.youtube.com/watch?v=-MUOweQ6wac
// and this article to learn triangle subdivision  - https://www.tylerxhobbs.com/words/aesthetically-pleasing-triangle-subdivision

// Basically im starting with a square and dividing it into triangles then those into further smaller randomness but with randomness for where the points get placed. 
//Point d is always 0.5 so it doesnt get too crazy


const m = 10; //margin
const depthLimit= 6; // how many subdivisions // how deep it will look
const dividePoint = 0.6; // 0.5 makes it perfect, other values introduce randomness > 0.5 - smaller triangles to sides, < 0.5 - larger triangles to sides

let triangles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Makes stroke sharper
  stroke(0);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  strokeWeight(1);
  noFill();
// For easier gradients
  colorMode(HSB, 360, 100, 100, 100);

  generateTriangles();
}

function draw() {
  background(0); 


  for (const triangle of triangles) {
    triangle.draw();
  }
}



class Triangle {
  constructor(side1, side2, side3) {
    this.side1 = side1;
    this.side2 = side2;
    this.side3 = side3;
  }

  draw() {
  //From gradient example on youtube
 let gradient = drawingContext.createLinearGradient(
  width/2-200, height/2-200, width/2+200, height/2+200
  );
  gradient.addColorStop(0, color(frameCount % 360, 100, 100, 100));
  gradient.addColorStop(1, color((frameCount + 180) % 360, 100,100, 100));
  
  drawingContext.strokeStyle = gradient;
  strokeWeight(10);


    triangle(
      this.side1[0], this.side1[1],
      this.side2[0], this.side2[1],
      this.side3[0], this.side3[1]
    );
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

// Create two triangles as a starting point
function generateTriangles() {

  triangles = [];
  
  const triangle1 = new Triangle(
    [0, 0],
    [width, 0],
    [0, height]
  );
  const triangle2 = new Triangle(
    [width, height],
    [0, height],
    [width, 0]
  );

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
  const d12 = distanceSquared(side1, side2);
  const d23 = distanceSquared(side2, side3);
  const d31 = distanceSquared(side3, side1);


  if (d12 >= d23 && d12 >= d31) {
    return { pointA: side1, pointB: side2, opposite: side3 };
  } else if (d23 >= d12 && d23 >= d31) {
    return { pointA: side2, pointB: side3, opposite: side1 };
  } else {
    return { pointA: side3, pointB: side1, opposite: side2 };
  }
}

function lerpPoints(pointA, pointB, interpolation) {
  return [pointA[0] + (pointB[0] - pointA[0]) * interpolation, pointA[1] + (pointB[1] - pointA[1]) * interpolation];
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
  clear();
  setup();
}
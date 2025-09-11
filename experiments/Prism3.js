// Recreation of this prsim type art made by Tezumie using P5.js https://www.reddit.com/r/generative/comments/1n51jga/sketch_made_with_p5js/?show=original 
// with help from this video for gradients https://www.youtube.com/watch?v=-MUOweQ6wac
// and this article to learn triangle subdivision  - https://www.tylerxhobbs.com/words/aesthetically-pleasing-triangle-subdivision

// Basically im starting with a square and dividing it into triangles then those into further smaller randomness but with randomness for where the points get placed. 
//Point d is always 0.5 so it doesnt get too crazy


let mt;
let mb;
let ms;
let isDone = false;

const depthLimit = 4; // how many subdivisions // how deep it will look
let dividePoint; // moved to be able to randomize - 0.5 makes it perfect, other values introduce randomness > 0.5 - smaller triangles to sides, < 0.5 - larger triangles to sides

// const slateGrey = { start: [15, 95, 75], end: [9, 21, 47], };
// const skyBlue = { start: [51, 139, 194], end: [187 , 184, 203], };
// const sunsetOrange = { start: [220, 120, 102], end: [244, 209, 154], };
// const cloudWhite = {start: [201,214,255], end: [226, 226, 226], };

//Preconfigured palettes, 0 = ground, 1 = sky, 2 = sun, 3 = clouds
const grassyMountains = [
  { start: [15, 95, 75], end: [9, 21, 47], },
  { start: [51, 139, 194], end: [229, 199, 208], },
  { start: [220, 120, 102], end: [244, 209, 154], },
  { start: [201,214,255], end: [226, 226, 226], },
]
const redDesert = [
  { start: [220, 120, 102], end: [244, 209, 154], },
  { start: [201,214,255], end: [226, 226, 226], },
  { start: [15, 95, 75], end: [9, 21, 47], },
  { start: [51, 139, 194], end: [229, 199, 208], },
]

const gradients = [grassyMountains, redDesert];
const activeGradient = gradients[Math.floor(Math.random() * gradients.length)];

// const gradients = [
//   { start: [15, 95, 75], end: [9, 21, 47], },
//   { start: [51, 139, 194], end: [229, 199, 208], },
//   { start: [220, 120, 102], end: [244, 209, 154], },
//   // { start: [38, 126, 39], end: [190, 201, 10], },
//   // { start: [38, 126, 39], end: [190, 201, 10], },
// ];

let triangles = [];

function setup() {
createCanvas(windowWidth, windowHeight);

mt = 0;
  mb = 0;
  ms = 0;
// mt = height/ (6 + 2);
//   mb = height/ (6 - 2);
//   ms = width/5;


  pixelDensity(1); // Makes stroke sharper
  strokeCap(ROUND);
  strokeJoin(ROUND);
  strokeWeight(0);
  // noLoop();
  // noFill();
  generateTriangles();

 
}

function draw() {
  // cream background
  background(255,245,230); 

  
  
  for (const triangle of triangles) {
    triangle.draw();
  }
 
  // if (!isDone) {
  //   isDone = true;
  //   noiseOverlay();
  // }
  
}



class Triangle {
  constructor(side1, side2, side3) {
    this.side1 = side1;
    this.side2 = side2;
    this.side3 = side3;
    
    this.center = [
      (side1[0] + side2[0] + side3[0]) / 3,
      (side1[1] + side2[1] + side3[1]) / 3
    ];

    this.gradient = this.determineGradient();
  }

  determineGradient() {
    let bottomPoints = 0;
    let sidePoints = 0;
    let topPoints = 0;
    let leftPoints = 0;

    // Check each point
    const points = [this.side1, this.side2, this.side3];
    for (const point of points) {
      // Check bottom
      if (Math.abs(point[1] - height) < 1) {
        bottomPoints++;
      }
 // Check top
 else if (Math.abs(point[1]) < 1) {
  topPoints++;
} 

      // Check left
      if (Math.abs(point[0]) < 1) {
        leftPoints++;
        sidePoints++;
      }
      // Check sides
      else if (Math.abs(point[0] - width) < 1) {
        sidePoints++;
      }
     
    }


    switch (true) {
      case bottomPoints >= 1 && sidePoints <= 2:
        return activeGradient[0];
      case topPoints === 1 && leftPoints === 1:
        return activeGradient[2];
      case topPoints === 1 && sidePoints >= 0 && leftPoints <= 1 :
        return activeGradient[3];
      default:
        return activeGradient[1];
    }
  }

  draw() {
    randomSeed(1);
    const gradientSize = random(20, 200);
    let gradient = drawingContext.createLinearGradient(
      this.center[0] - gradientSize, this.center[1] - gradientSize,
      this.center[0] + gradientSize, this.center[1] + gradientSize
    );

  //Wanna try randomize direction here
    const [h1, s1, b1] = this.gradient.start;
    const [h2, s2, b2] = this.gradient.end;
    gradient.addColorStop(0, color(h1, s1, b1));
    gradient.addColorStop(1, color(h2, s2, b2));

    drawingContext.fillStyle = gradient;

    triangle(
      this.side1[0], this.side1[1],
      this.side2[0], this.side2[1],
      this.side3[0], this.side3[1]
    );
  }

  subdivide() {
    dividePoint = 0.2 + 0.4 * Math.random();
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
    [0 + ms, 0 + mt],
    [width - ms, 0 + mt],
    [0 + ms, height - mb]
  );
  const triangle2 = new Triangle(
    [width - ms, height - mb],
    [0 + ms, height - mb],
    [width - ms, 0 + mt]
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

function noiseOverlay() {
  for (let x = 0; x < width; x++ ) {
    for (let y = 0; y < height; y++ ) {
      if (Math.random() > 0.7) {
        fill(0);
        square(x, y, 1);
      }
    }
  }
  isDone = true;
}


function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
  clear();
  setup();
  draw();
}
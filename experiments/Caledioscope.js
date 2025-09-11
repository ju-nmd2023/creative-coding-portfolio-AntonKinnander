let position;
let velocity;
let acceleration;

function setup() {
  createCanvas(innerWidth, innerHeight);
  position = createVector(300, 300);
  velocity = createVector(5, 8);
  //   acceleration = createVector(0, 0);
  background(0);
  colorMode(HSB);
  frameRate(20);
  //   noLoop();
}

function draw() {
  noStroke();
  push();
  fill(random(0, 80), random(50, 90), 100);
  ellipse(position.x, position.y, Math.random() * velocity.mag());
  fill(random(230, 360), random(50, 90), 100);
  ellipse(
    width - position.x,
    height - position.y,
    Math.max(10, velocity.mag())
  );
  ellipse(
    width + position.x,
    height - position.y,
    Math.max(10, velocity.mag())
  );
  ellipse(
    width - position.x,
    height + position.y,
    Math.max(10, velocity.mag())
  );
  ellipse(width + position.x, height + position.y, random(10, 60));

  pop();

  if (position.x > width || position.x < 0) {
    velocity.x = -velocity.x;
  }
  if (position.y > height || position.y < 0) {
    velocity.y = -velocity.y;
  }

  const mouse = createVector(mouseX, mouseY);
  //Establish the connection between the mouse and the position
  acceleration = p5.Vector.sub(mouse, position);

  velocity.add(acceleration);
  acceleration.normalize();
  velocity.limit(10);
  position.add(velocity);
}

//Why cant i add 4 circles only top right and bottom left? 


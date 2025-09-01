// P5.js recreation of the Anne by Georg Nees

// Looking at the original it looks like there are lines beginning at the edges of the canvas and extending towards origo (0,0)
// Also the line density increases as they get closer to the 0 coordinate of their axis, which creates a 3d effect

// Basically im thinking i could just create lines along the edges of the canvas, going towards origo, the dark shape in the middle should still appear because close to 0 x or y there will be a huge amount of lines crammed into the space.

// Idea, have clicking reveal an eye in the middle (blinking) with a mitten av ögat that follows the mouse

function setup() {
    createCanvas(innerWidth, innerHeight);
    background(15, 0, 152);
  }

function draw() {
    colormode(RGB);
    background(34, 39, 46);
    fill(108, 182, 255);
    stroke(255, 255, 255);

    push();
    // easier for me to understand since the center is the center (origo)
    translate(width / 2, height / 2);

    // draw rows of lines along edges - 0,full height, full width,0 , 
    
}
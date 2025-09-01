// P5.js recreation of the Anne by Georg Nees

// Looking at the original it looks like there are lines beginning at the edges of the canvas and extending towards origo (0,0)
// Also the line density increases as they get closer to the 0 coordinate of their axis, which creates a 3d effect

// Basically im thinking i could just create lines along the edges of the canvas, going towards origo, the dark shape in the middle should still appear because close to 0 x or y there will be a huge amount of lines crammed into the space.

// Idea, have clicking reveal an eye in the middle (blinking) with a mitten av ögat that follows the mouse

function setup() {
    createCanvas(innerWidth, innerHeight);
  }
  
  function draw() {
    background(15, 0, 152);
    stroke(255, 255, 255);
    strokeWeight(3);
  
    push();
    // easier for me to understand since the center is the center (origo)
    translate(width / 2, height / 2);
  
    // draw rows of lines along edges - Top + bottom = x value controlled coords 0,height/2 - 0,-height/2. Vice versa for sides. One node of lines is always origo
    let numLines = 30; 
  
    // Draw lines, pow for density increase as they get closer to origo ( I was trying to make it work with absolute values and division but after consulting chatgpt i realized pow was easier)
    for (let i = 0; i <= numLines; i++) {
   
      let t = map(i, 0, numLines, -1, 1);
      let density = pow(t, 3);
  
      let x = density * (width / 2);
      let y = density * (height / 2);
  
      // x
      line(x, -height / 2, 0, 0);
      line(x, height / 2, 0, 0);
     
      // y
      line(-width / 2, y, 0, 0);
      line(width / 2, y, 0, 0);
    }
  

  
    pop();
  }
  

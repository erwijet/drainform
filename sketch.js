let obj;

let innerRectHeightSlider;
let innerRectWidthSlider;
let openHeightDialogButton;
let openWidthDialogButton;


function setup() {
  let cvs = createCanvas(400, 400);
  
  cvs.position((windowWidth - width / 2), (windowHeight - height) / 2);
  
  ellipseMode(CENTER);
  textAlign(CENTER);
  
  innerRectHeightSlider = createSlider(14, 84, 80);
  innerRectWidthSlider = createSlider(14, 120, 100);
  
  openHeightDialogButton = createButton("Manual");
  openHeightDialogButton.mousePressed(() => {
    innerRectWidthSlider.value(prompt("Inner Basin Width (Measurement A)"));
  });
  
  openWidthDialogButton = createButton("Manual");
  openWidthDialogButton.mousePressed(() => {
    innerRectHeightSlider.value(prompt("Inner Basin Height (Measurement B)"));
  });
  
  openHeightDialogButton.position(20, 320);
  openWidthDialogButton.position(20, 350);
  
  innerRectWidthSlider.position(90, 320);
  innerRectHeightSlider.position(90, 350);
  
  obj = new DraggableRect(100, 120, 100 * 2, 80 * 2);
}

function draw() {
  noFill();
  background(220);
  
  // Draw Measurement lines
  DrawMeasureLines();
  
  // Draw full sheet of solid surface
  rectMode(CENTER);
  rect(width / 2, height / 2, 120 * 2, 84 * 2);
  
  // Draw Draggable Pan
  rectMode(CORNER);
  obj.update();
  obj.draw();
  
  // Draw Drain
  fill(0);
  ellipse(width / 2, height / 2, 4, 4); // drain
  
  // Draw Slider Preview
  push();
  strokeWeight(1);
  text("A: " + innerRectWidthSlider.value(), 350, 335);
  text("B: " + innerRectHeightSlider.value(), 350, 365);
  
  // Update Draggable Pan Size
  let newH = innerRectHeightSlider.value() * 2;
  let newW = innerRectWidthSlider.value() * 2;
  
  if (obj.h != newH)
    obj.y += (obj.h - newH) / 2;
  if (obj.w != newW)
    obj.x += (obj.w - newW) / 2;
  
  obj.h = innerRectHeightSlider.value() * 2;
  obj.w = innerRectWidthSlider.value() * 2;
}

function mousePressed() {
  obj.mousePressed();
}

function mouseReleased() {
  obj.mouseReleased();
}

function DrawMeasureLines() {
  stroke(0);
  strokeWeight(2);
  
  // C LINE MEASUREMENT
  
  const CLineY = 60;
  
  line(obj.x, CLineY, width / 2, CLineY);
  line(obj.x, CLineY - 5, obj.x, CLineY + 5);
  line(width / 2, CLineY - 5, width / 2, CLineY + 5);
  
  push();
  strokeWeight(1);
  text("C: " + ((width / 2) - obj.x) / 2, obj.x + ((width / 2) - obj.x) / 2, CLineY - 20);
  pop(); 
  
  // D LINE MEASUREMENT
  
  const DLineX = 60;
  line(DLineX, obj.y, DLineX, height / 2);
  line(DLineX - 5, obj.y, DLineX + 5, obj.y);
  line(DLineX - 5, height / 2, DLineX + 5, height / 2);
  
  push();
  strokeWeight(1);
  text("D: " + ((height / 2) - obj.y) / 2, DLineX - 30, obj.y + ((height / 2) - obj.y) / 2);
  pop();
  
  // Draw Dotted Lines
  
  DottedLine(width / 2, CLineY, width / 2, height / 2);
  DottedLine(obj.x, CLineY, obj.x, height / 2);
  DottedLine(DLineX, obj.y, width / 2, obj.y);
  DottedLine(DLineX, height / 2, width / 2, height / 2);
}

function DottedLine(startX, startY, endX, endY) {
  const amt = 0.05;
  let cnt = 1 / amt;
  
  let dx = endX - startX;
  let dy = endY - startY;
  
  let thisX = startX;
  let thisY = startY;
  
  for (let i = 0; i < cnt; i++) {
    thisX += dx * amt;
    thisY += dy * amt;
    ellipse(thisX, thisY, 0.5, 0.5);
  }
}

function DraggableRect(x, y, w, h) {
  this.w = w;
  this.h = h;
  this.x = x;
  this.y = y;
  
  this.offsetX = 0;
  this.offsetY = 0;
  
  this.dragging = false;
  
  this.mousePressed = function () {
    if (mouseX >= this.x &&
        mouseX <= this.x + this.w &&
        mouseY >= this.y &&
        mouseY <= this.y + this.h) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }
  
  this.mouseReleased = function () {
    this.dragging = false;
  }
  
  this.update = function () {
    if (this.dragging) {
      if (
          // inner rect right bound to the right of drain
          mouseX + this.offsetX + this.w >= width / 2 && 
          // inner rect left bound to the left of drain
          mouseX + this.offsetX <= width / 2 &&
          // inner rect left bound within parent rect
          mouseX + this.offsetX >= (width / 2) - (60 * 2) &&
          // min of 7in (14 px)
          (width / 2) - (mouseX + this.offsetX) >= 7 * 2 && 
          (mouseX + this.offsetX + this.w) - (width / 2) >= 7 * 2 &&
          // inner rect right bound within parent rect
          mouseX + this.offsetX + this.w <= (width / 2) + (60 * 2)) {
        
        // update location if all conditions met
        this.x = mouseX + this.offsetX;
      }
      if (mouseY + this.offsetY + this.h >= height / 2 && 
          mouseY + this.offsetY <= height / 2 &&
          mouseY + this.offsetY >= (height / 2) - (42 * 2) &&
          (height / 2) - (mouseY + this.offsetY) >= (7 * 2) && 
          (mouseY + this.offsetY + this.h) - (height / 2) >= 7 * 2 &&
          mouseY + this.offsetY + this.h <= (height / 2) + (42 * 2)) {
        this.y = mouseY + this.offsetY;
      }
    }
  }
  
  this.draw = function() {
    rect(this.x, this.y, this.w, this.h);
  }
}
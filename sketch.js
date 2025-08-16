let ramp = "@#W$9876543210?!abc;:,. ";
let video;
let charSize = 12;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width / charSize, height / charSize); // downscale for ASCII
  video.hide();
  textFont('monospace', charSize);
  textAlign(LEFT, TOP);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(width / charSize, height / charSize);
}

function draw() {
  background(0);
  video.loadPixels();
  
  let N_x = video.width;
  let N_y = video.height;
  
  let gridWidth = video.width * charSize;
  let gridHeight = video.height * charSize;
  let xOffset = (width - gridWidth) / 2;
  let yOffset = (height - gridHeight) / 2;

  for (let y = 0; y < N_y; y++) {
    for (let x = 0; x < N_x; x++) {
      let index = (x + y * N_x) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index+1];
      let b = video.pixels[index+2];
      
      // Base brightness
      let bright = (r + g + b) / 3;
      let norm = bright / 255; // 0-1
      
      // Apply Perlin noise for flowing effect
      let flow = noise(x*0.3, y*0.3 + t) * 0.5; 
      let value = norm + flow; 
      value = constrain(value, 0, 1); // keep in 0-1
      
      // Map to ASCII character
      let charIndex = floor(map(value, 0, 1, ramp.length-1, 0));
      let c = ramp[charIndex];
      
      // Map to heatmap color
      let col = heightToColor(value, 0, 1);
      fill(col);
      
      // Draw character
      text(c, xOffset + x*charSize, yOffset + y*charSize);
    }
  }
  
  t += 0.1; // controls speed of flow
}

// Heatmap function: blue → cyan → green → yellow → red
function heightToColor(norm, minVal, maxVal) {
  if (norm < 0.25) return lerpColor(color(0,0,255), color(0,255,255), norm/0.25);
  else if (norm < 0.5) return lerpColor(color(0,255,255), color(0,255,0), (norm-0.25)/0.25);
  else if (norm < 0.75) return lerpColor(color(0,255,0), color(255,255,0), (norm-0.5)/0.25);
  else return lerpColor(color(255,255,0), color(255,0,0), (norm-0.75)/0.25);
}

let ramp = "@%#*+=-:.~ "
let hills = [];
let t = 0;                // time for animation

function setup() {
  createCanvas(800, 800);
  textFont('monospace', 15);   // increase font size for visibility
  textAlign(LEFT, TOP);        // align text top-left for easier placement
  frameRate(3);
  
  // Create random hills/valleys
  for (let k = 0; k < 6; k++) {
    hills.push({
      x: random(-2, 2),       // hill center (x)
      y: random(-2, 2),       // hill center (y)
      a: random(-1, 1),       // amplitude (hill or valley)
      s: random(0.8, 2.0)     // spread
    });
  }
  
  frameRate(6);  // slow down a little so the flow is visible
}

function heightAt(x, y) {
  return (
    cos(0.6*x + 0.4*y) +
    0.7*sin(0.3*x - 0.5*y) +
    0.5*cos(0.8*y + 1.1)
  );
}

function heightToColor(val, minVal, maxVal) {
  // Normalize value to 0–1
  let norm = (val - minVal) / (maxVal - minVal + 1e-9);
  
  // Map normalized value to a gradient: blue → cyan → green → yellow → red
  if (norm < 0.25) return lerpColor(color(0,0,255), color(0,255,255), norm/0.25);
  else if (norm < 0.5) return lerpColor(color(0,255,255), color(0,255,0), (norm-0.25)/0.25);
  else if (norm < 0.75) return lerpColor(color(0,255,0), color(255,255,0), (norm-0.5)/0.25);
  else return lerpColor(color(255,255,0), color(255,0,0), (norm-0.75)/0.25);
}


function mapToChar(val, minVal, maxVal) {
  let norm = (val - minVal) / (maxVal - minVal + 1e-9); // normalize to 0–1
  let idx = floor(norm * (ramp.length - 1));
  return ramp[idx];
}

function draw() {
  background(255);
  fill(0);
  
  let N = 65;
  let values = [];
  
  // First pass: compute all values with a vertical time offset
  let minVal = 1e9, maxVal = -1e9;
  for (let i = 0; i < N; i++) {
    values[i] = [];
    for (let j = 0; j < N; j++) {
      let x = map(i, 0, N-1, -2, 2);
      let y = map(j, 0, N-1, -2, 2) + t;   // add time to y → scrolling up
      let h = heightAt(x, y);
      values[i][j] = h;
      minVal = min(minVal, h);
      maxVal = max(maxVal, h);
    }
  }
  
  // Second pass: render as ASCII characters
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      let c = mapToChar(values[i][j], minVal, maxVal);
      fill(heightToColor(values[i][j], minVal, maxVal)); // color per character
      text(c, 10 + i * 10, 20 + j * 10);
    }
}
  
  // Advance time
  t += 0.2;
}

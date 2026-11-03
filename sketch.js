// The Display is Ultra HD, mounted portrait.
const DISPLAY_W = 2160;
const DISPLAY_H = 3840;

// Reads a token from the @theme block in app.css.
function token(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

let bg;

function setup() {
  pixelDensity(1); // keeps the canvas at true Display size on high-density laptop screens
  createCanvas(DISPLAY_W, DISPLAY_H).parent('display');
  bg = token('--color-display-bg');
}

function draw() {
  // The browser canvas accepts any CSS color, including oklch.
  drawingContext.fillStyle = bg;
  drawingContext.fillRect(0, 0, width, height);
}

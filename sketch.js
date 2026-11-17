// The Display is Ultra HD, mounted portrait.
const DISPLAY_W = 2160;
const DISPLAY_H = 3840;

// Mapping table, wind speed row 1: angle of each new chalk line.
// 0 to 40 mph maps linearly to 0 to 35 degrees from level, held at 35 above 40 mph.
const WIND_MIN_MPH = 0;
const WIND_MAX_MPH = 40;
const ANGLE_MIN_DEG = 0;
const ANGLE_MAX_DEG = 35;

// Mapping table, temperature row: framing grid spacing, colder is tighter.
// Each band runs up to (not including) maxF. Spacing is inches on center.
// Bands agreed with the designer; not yet written into SPEC.md.
const TEMP_MIN_F = 0;
const STUD_BANDS = [
  { maxF: 32, inches: 12 },
  { maxF: 55, inches: 16 },
  { maxF: 75, inches: 19.2 },
  { maxF: Infinity, inches: 24 },
];

// Reads a token from the @theme block in app.css.
function token(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

let bg;
let chalk;
let chalkStroke;
let studs;
let studWidth;
let pxPerInch;

// Every line that has snapped today. Each keeps the angle it snapped at.
const lines = [];

function setup() {
  pixelDensity(1); // keeps the canvas at true Display size on high-density laptop screens
  createCanvas(DISPLAY_W, DISPLAY_H).parent('display');
  angleMode(DEGREES);
  bg = token('--color-display-ground');
  chalk = token('--color-display-chalk-500');
  chalkStroke = parseFloat(token('--spacing-display-chalk-stroke')); // "20px" -> 20
  studs = token('--color-display-studs');
  studWidth = parseFloat(token('--spacing-display-stud'));
  pxPerInch = parseFloat(token('--spacing-display-inch'));
}

function draw() {
  // The browser canvas accepts any CSS color, including oklch.
  drawingContext.fillStyle = bg;
  drawingContext.fillRect(0, 0, width, height);

  drawStuds();

  stroke(chalk);
  strokeWeight(chalkStroke);
  for (const l of lines) {
    // Pivot on the board's center line so the angle tilts the line evenly across the width.
    const rise = tan(l.angle) * (width / 2);
    line(0, l.y - rise, width, l.y + rise);
  }
}

// Stud spacing in inches on center, from the current temperature.
// Snaps straight to the new band for now; the 10-minute ease comes later.
function studSpacingInches() {
  const f = Weather.get('temperature_2m', TEMP_MIN_F);
  return STUD_BANDS.find((band) => f < band.maxF).inches;
}

// Full-height vertical studs, laid out from the left edge like a framed wall.
function drawStuds() {
  const spacing = studSpacingInches() * pxPerInch;
  drawingContext.fillStyle = studs;
  for (let x = 0; x < width; x += spacing) {
    drawingContext.fillRect(x - studWidth / 2, 0, studWidth, height);
  }
}

// Angle for a new line, from the current wind speed.
function windAngle() {
  const mph = Weather.get('wind_speed_10m', WIND_MIN_MPH);
  return constrain(
    map(mph, WIND_MIN_MPH, WIND_MAX_MPH, ANGLE_MIN_DEG, ANGLE_MAX_DEG),
    ANGLE_MIN_DEG,
    ANGLE_MAX_DEG
  );
}

// OPEN ISSUE: lines can land anywhere on the canvas, including the caption zone
// at the bottom. SPEC.md doesn't say where the board ends and the caption zone
// begins yet. Limit the y range here once the designer sets that boundary.
function snapLine() {
  lines.push({ y: random(height), angle: windAngle() });
}

// Testing shortcut: press S to snap a line now instead of waiting.
function keyPressed() {
  if (key === 's' || key === 'S') snapLine();
}

// Based on a tutorial by Marc Duiker, @marcduiker, August 2021.
// YouTube: https://www.youtube.com/watch?v=M3wTNVICUTg
// Also inpired by the Brightness Mirror video from The Coding Train: https://www.youtube.com/watch?v=rNqaw8LT2ZU
// Implemented the key interactions and stripes and squares

const videoXResolution = 640;
const videoYResolution = 480;

let video;
let pixelSize = 10;
const minSize = 5;
const maxSize = 50;
let windowVideoRatio;
let colorButton;
let videoModeButton;
let isProcessingEnabled = true;
let colorModeIndex = 0;
let lastColorModeIndex = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(videoXResolution, videoYResolution);
  //scale(-1, 1);
  video.hide();
  windowVideoRatio = windowWidth / video.width;
}

//scelta tasti da premere
function keyPressed() {
  if (keyCode === SHIFT) {
    changeColorMode();
  } else if (keyCode === CONTROL) {
    changeProcessing();
  }
}

function draw() {
  background(0);
  video.loadPixels();
  if (isProcessingEnabled) {
    pixelSize = int(map(mouseX, 0, windowWidth, minSize, maxSize));

    for (let x = 0; x < video.width; x += pixelSize) {
      for (let y = 0; y < video.height; y += pixelSize) {
        let index = (y * video.width + x) * 4;
        let r = video.pixels[index + 0];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];

        let newColor = getColor(r, g, b);

        // Scale to fit windowWidth:
        let scaledX = floor(x * windowVideoRatio);
        let scaledY = floor(y * windowVideoRatio);
        let scaledPixelSize = ceil(pixelSize * windowVideoRatio);

        noStroke();
        fill(newColor);
        circle(scaledX, scaledY, scaledPixelSize, scaledPixelSize);
      }
    }
  } else {
    image(
      video,
      0,
      0,
      videoXResolution * windowVideoRatio,
      videoYResolution * windowVideoRatio
    );
  }
  //black background
  fill("black");
  rect(0, 0, windowWidth, 120);
  fill("lightgreen");
  textAlign(CENTER);
  textFont("Helvetica");
  textSize(20);
  //strokeWeight(4);
  //stroke(51);
  text("Press SHIFT to get funky :D", windowWidth / 2, 60);
  text("Press OPTION/CONTROL to toggle/untoggle filters", windowWidth / 2, 90);
  text("Move mouse left to right to change dot size", windowWidth / 2, 30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function changeColorMode() {
  if (colorModeIndex < lastColorModeIndex) {
    colorModeIndex++;
  } else {
    colorModeIndex = 0;
  }
}

function changeProcessing() {
  isProcessingEnabled = !isProcessingEnabled;
}

function getColor(r, g, b) {
  let newColor;
  switch (colorModeIndex) {
    case 0:
      newColor = color(r, g, b);
      break;
    case 1:
      newColor = getGrayScaleColor(r, g, b);
      break;
    case 2:
      newColor = getGameboyColor(r, g, b);
      break;
    case 3:
      newColor = getFunkyFutureColor(r, g, b);
      break;
    case 4:
      newColor = getFairyDustColor(r, g, b);
      break;
  }

  return newColor;
}

function getGrayScaleColor(r, g, b) {
  // Gray scale based on linear luminance for each color channel:
  // https://en.wikipedia.org/wiki/Grayscale
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getGameboyColor(r, g, b) {
  // Color palette source:
  // https://lospec.com/palette-list/kirokaze-gameboy

  let grayScale = getGrayScaleColor(r, g, b);
  let colorPalette = ["#332c50", "#46878f", "#94e344", "#e2f3e4"];
  let index = floor(map(grayScale, 0, 255, 0, 4));

  return colorPalette[index];
}

function getFunkyFutureColor(r, g, b) {
  // Color palette source:
  // https://lospec.com/palette-list/funkyfuture-8

  let colorPalette = [
    "#2b0f54",
    "#ab1f65",
    "#ff4f69",
    "#fff7f8",
    "#ff8142",
    "#ffda45",
    "#3368dc",
    "#49e7ec",
  ];

  return getNearestColorInPalette(colorPalette, r, g, b);
}

function getFairyDustColor(r, g, b) {
  // Color palette source:
  // https://lospec.com/palette-list/fairydust-8

  let colorPalette = [
    "#f0dab1",
    "#e39aac",
    "#c45d9f",
    "#634b7d",
    "#6461c2",
    "#2ba9b4",
    "#93d4b5",
    "#f0f6e8",
  ];

  return getNearestColorInPalette(colorPalette, r, g, b);
}

function getNearestColorInPalette(colorPalette, r, g, b) {
  let nearestColorIndex = 0;
  let nearestColorDistance = 255;
  for (let c = 0; c < colorPalette.length; c++) {
    let indexColor = color(colorPalette[c]);
    let indexRed = red(indexColor);
    let indexGreen = green(indexColor);
    let indexBlue = blue(indexColor);
    let colorDist = dist(r, g, b, indexRed, indexGreen, indexBlue);
    if (colorDist < nearestColorDistance) {
      nearestColorDistance = colorDist;
      nearestColorIndex = c;
    }
  }

  return colorPalette[nearestColorIndex];
}

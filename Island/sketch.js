let cellSize = 11;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let cellScale = [];



function setup() {
  frameRate(10);
  createCanvas(windowWidth, windowHeight);
  initializeBoard();
  noLoop();
}

function initializeBoard() {
  columnCount = floor(width / cellSize);
  rowCount = floor(height / cellSize);

  currentCells = [];
  nextCells = [];
  cellScale = [];

  for (let c = 0; c < columnCount; c++) {
    currentCells[c] = [];
    nextCells[c] = [];
    cellScale[c] = [];
  }

  randomizeBoard();
  randomizeCellSizes();
}

function draw() {
  //background(225,225,210);
   background(0);
  generate();
 

push();
//translate(width * 0.40, 0);

for (let column = 0; column < columnCount; column++) {
  for (let row = 0; row < rowCount; row++) {
    let cell = currentCells[column][row];
    let s = cellScale[column][row];

    if (cell === 1) fill(107, 255, 4);
    else fill(random([color(255,0), color(17, 15, 14)]));
    // else fill(random([color(207, 255, 4)]));


    noStroke();
    //rect(column * cellSize, row * cellSize, s, s);
    let x = column * cellSize + cellSize / 2;
let y = row * cellSize + cellSize / 2;
ellipse(x, y, 10, 10);
  }
}

pop();

}

function mousePressed() {
  randomizeBoard();
  randomizeCellSizes();
  loop();
}


// ------------------------------------------------------------
// Tamaños aleatorios: 20, 40, 80
// ------------------------------------------------------------
function randomizeCellSizes() {
  let sizes = [20, 40, 80];
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      cellScale[c][r] = random(sizes);
    }
  }
}

// ------------------------------------------------------------
// Game of Life
// ------------------------------------------------------------
function randomizeBoard() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      currentCells[c][r] = random([0, 1]);
    }
  }
}

function generate() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      let left = (c - 1 + columnCount) % columnCount;
      let right = (c + 1) % columnCount;
      let above = (r - 1 + rowCount) % rowCount;
      let below = (r + 1) % rowCount;

      let neighbours =
        currentCells[left][above] +
        currentCells[c][above] +
        currentCells[right][above] +
        currentCells[left][r] +
        currentCells[right][r] +
        currentCells[left][below] +
        currentCells[c][below] +
        currentCells[right][below];

      if (neighbours < 2 || neighbours > 3) nextCells[c][r] = 0;
      else if (neighbours === 3) nextCells[c][r] = 1;
      else nextCells[c][r] = currentCells[c][r];
    }
  }

  let temp = currentCells;
  currentCells = nextCells;
  nextCells = temp;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeBoard();
}
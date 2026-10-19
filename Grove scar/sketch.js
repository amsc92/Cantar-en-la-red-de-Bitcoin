// The snake moves along a grid, one space at a time
// The grid is smaller than the canvas, and its dimensions
//  are stored in these variables
let gridWidth = 30;
let gridHeight = 30;

let gameStarted = false;

// How many segments snake starts with
let startingSegments = 10;

// Starting coordinates for first segment
let xStart = 0;
let yStart = 15;

// Starting direction of motion
let startDirection = 'right';

// Current direction of motion
let direction = startDirection;

// The snake is divided into small segments,
// stored as vectors in this array
let segments = [];

let score = 0;
let highScore;
let seedPopupFrames = 0;
let touchStartX = null;
let touchStartY = null;
let activePointerId = null;

// The fruit's position is stored as a vector
// in this variable
let fruit;

function setup() {
  createCanvas(500, 500).parent('game-board');

  // Adjust frame rate to set movement speed
  frameRate(10);

  textAlign(CENTER, CENTER);
  textSize(2);

  // Check for saved high score in local browser storage
  // If no score has been stored, this will be undefined
  highScore = getItem('high score');

  describe(
    'Snake game. Use the arrow keys, swipe on the game board, or use the on-screen direction buttons to guide the snake toward the fruit.'
  );

  const canvas = document.querySelector('#game-board canvas');
  canvas.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    touchStartX = event.clientX;
    touchStartY = event.clientY;
    activePointerId = event.pointerId;
  }, { capture: true });
  window.addEventListener('pointermove', (event) => {
    if (
      event.pointerType !== 'touch' ||
      event.pointerId !== activePointerId ||
      touchStartX === null ||
      touchStartY === null
    ) {
      return;
    }

    const deltaX = event.clientX - touchStartX;
    const deltaY = event.clientY - touchStartY;
    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 24) {
      changeDirection(
        Math.abs(deltaX) > Math.abs(deltaY)
          ? deltaX > 0
            ? 'right'
            : 'left'
          : deltaY > 0
            ? 'down'
            : 'up',
      );
      touchStartX = null;
      touchStartY = null;
    }
  });
  const clearSwipe = () => {
    touchStartX = null;
    touchStartY = null;
    activePointerId = null;
  };
  window.addEventListener('pointerup', (event) => {
    if (event.pointerType === 'touch' && !gameStarted) {
      startGame();
    }
    clearSwipe();
  });
  window.addEventListener('pointercancel', clearSwipe);

  document.querySelectorAll('.touch-controls [data-direction]').forEach((button) => {
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      changeDirection(button.dataset.direction);
    });
  });
  window.addEventListener('keydown', handleArrowKey);
}

function draw() {
  background(0);

  // Set scale so that the game grid fills canvas
  scale(width / gridWidth, height / gridHeight);
  if (gameStarted === false) {
    showStartScreen();
  } else {
    // Shift over so that snake and fruit are still on screen
    // when their coordinates are 0
    translate(0.5, 0.5);
    showFruit();
    showSegments();
    updateSegments();
    checkForCollision();
    checkForFruit();
    if (seedPopupFrames > 0) {
      showSeedPopup();
      seedPopupFrames -= 1;
    }
  }
}

function showSeedPopup() {
  push();
  stroke(0, 255, 0);
  strokeWeight(0.15);
  fill(10, 10, 10, 245);
  rect(2, 9, gridWidth - 4, 12, 1);

  noStroke();
  fill(0, 255, 0);
  textAlign(CENTER, CENTER);
  textSize(1.1);
  textStyle(BOLD);
  text(
    'SEED\n\n/*\nPunuylla waway punuylla\nCopy Paste\n*/',
    gridWidth / 2,
    gridHeight / 2
  );
  pop();
}

function showStartScreen() {
  noStroke();
  fill(32);
  rect(2, gridHeight / 2 - 5, gridWidth - 4, 10, 2);
  fill(255);
  text('Tap or click to play.\nUse arrows or swipe to move.', gridWidth / 2, gridHeight / 2);
  noLoop();
}

function mousePressed() {
  if (gameStarted === false) {
    startGame();
  }
}

function startGame(initialDirection = startDirection) {
  // Put the fruit in a random place
  updateFruitCoordinates();

  direction = initialDirection;
  segments = [];
  const isVertical = direction === 'up' || direction === 'down';
  const firstHorizontalX =
    direction === 'left' ? Math.floor((gridWidth - startingSegments) / 2) : xStart;
  const firstVerticalY = Math.floor(gridHeight / 2) - Math.floor(startingSegments / 2);

  for (let offset = 0; offset < startingSegments; offset += 1) {
    const x = isVertical ? Math.floor(gridWidth / 2) : firstHorizontalX + offset;
    const y = isVertical ? firstVerticalY + offset : yStart;
    const segmentPosition = createVector(x, y);

    if (direction === 'right' || direction === 'down') {
      segments.unshift(segmentPosition);
    } else {
      segments.push(segmentPosition);
    }
  }

  score = 0;
  seedPopupFrames = 0;
  gameStarted = true;
  loop();
}

function showFruit() {
  stroke(255, 64, 32);
  point(fruit.x, fruit.y);
}

function showSegments() {
  noFill();
  stroke(96, 255, 64);
  beginShape();
  for (let segment of segments) {
    vertex(segment.x, segment.y);
  }
  endShape();
}

function updateSegments() {
  // Remove last segment
  segments.pop();

  // Copy current head of snake
  let head = segments[0].copy();

  // Insert the new snake head at the beginning of the array
  segments.unshift(head);

  // Adjust the head's position based on the current direction
  switch (direction) {
    case 'right':
      head.x = head.x + 1;
      break;
    case 'up':
      head.y = head.y - 1;
      break;
    case 'left':
      head.x = head.x - 1;
      break;
    case 'down':
      head.y = head.y + 1;
      break;
  }
}

function checkForCollision() {
  // Store first segment in array as head
  let head = segments[0];

  // If snake's head...
  if (
    // hit right edge or
    head.x >= gridWidth ||
    // hit left edge or
    head.x < 0 ||
    // hit bottom edge or
    head.y >= gridHeight ||
    // hit top edge or
    head.y < 0 ||
    // collided with itself
    selfColliding() === true
  ) {
    // show game over screen
    gameOver();
  }
}

function gameOver() {
  noStroke();
  fill(32);
  rect(2, gridHeight / 2 - 5, gridWidth - 4, 12, 2);
  fill(255);

  // Set high score to whichever is larger: current score or previous
  // high score
  highScore = max(score, highScore);

  // Put high score in local storage. This will be be stored in browser
  // data, even after the user reloads the page.
  storeItem('high score', highScore);
  text(
    `Game over!
Your score: ${score}
High score: ${highScore}
Click to play again.`,
    gridWidth / 2,
    gridHeight / 2
  );
  gameStarted = false;
  noLoop();
}

function selfColliding() {
  // Store the last segment as head
  let head = segments[0];

  // Store every segment except the first
  let segmentsAfterHead = segments.slice(1);

  // Check each of the other segments
  for (let segment of segmentsAfterHead) {
    // If segment is in the same place as head
    if (segment.equals(head) === true) {
      return true;
    }
  }
  return false;
}

function checkForFruit() {
  // Store first segment as head
  let head = segments[0];

  // If the head segment is in the same place as the fruit
  if (head.equals(fruit) === true) {
    // Give player a point
    score = score + 1;
    seedPopupFrames = 30;

    // Duplicate the tail segment
    let tail = segments[segments.length - 1];
    let newSegment = tail.copy();

    // Put the duplicate in the beginning of the array
    segments.push(newSegment);

    // Reset fruit to a new location
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {
  // Pick a random new coordinate for the fruit
  // and round it down using floor().
  // Because the segments move in increments of 1,
  // in order for the snake to hit the same position
  // as the fruit, the fruit's coordinates must be
  // integers, but random() returns a float
  let x = floor(random(gridWidth));
  let y = floor(random(gridHeight));
  fruit = createVector(x, y);
}

function changeDirection(nextDirection) {
  if (!gameStarted) {
    startGame(nextDirection);
    return;
  }

  const oppositeDirections = {
    right: 'left',
    left: 'right',
    up: 'down',
    down: 'up',
  };

  if (oppositeDirections[direction] !== nextDirection) {
    direction = nextDirection;
  }
}

function handleArrowKey(event) {
  const directionsByKey = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };
  const nextDirection = directionsByKey[event.key];

  if (nextDirection) {
    event.preventDefault();
    changeDirection(nextDirection);
  }
}

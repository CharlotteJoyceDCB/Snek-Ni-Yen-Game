const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const startGameBtn = document.getElementById('startGameBtn');
const restartBtn = document.getElementById('restartBtn');
const modal = document.getElementById('gameOverModal');

const gridSize = 25;
const containerSize = 500;
let snake = [{ x: 250, y: 250 }];
let food = getRandomFoodPosition();
let dx = gridSize;
let dy = 0;
let gameRunning = false;
let score = 0;
let gameInterval;
const chompSound = new Audio('sound/ah.mp3');

function getRandomFoodPosition() {
  const max = containerSize / gridSize;
  return {
    x: Math.floor(Math.random() * max) * gridSize,
    y: Math.floor(Math.random() * max) * gridSize
  };
}

function createSegment(x, y) {
  const segment = document.createElement('div');
  segment.className = 'snake-segment';
  segment.style.left = `${x}px`;
  segment.style.top = `${y}px`;
  gameContainer.appendChild(segment);
}

function createFood() {
  const foodElement = document.createElement('div');
  foodElement.className = 'food';
  foodElement.style.left = `${food.x}px`;
  foodElement.style.top = `${food.y}px`;
  gameContainer.appendChild(foodElement);
}

function updateSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    chompSound.currentTime = 0;
    chompSound.play();
    food = getRandomFoodPosition();
  } else {
    snake.pop();
  }
}

function drawGame() {
  gameContainer.innerHTML = '';
  snake.forEach(segment => createSegment(segment.x, segment.y));
  createFood();
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 || head.x >= containerSize ||
    head.y < 0 || head.y >= containerSize ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameRunning = false;
    showGameOverModal();
  }
}

function showGameOverModal() {
  modal.style.display = 'block';
  clearInterval(gameInterval);
}

function restartGame() {
  modal.style.display = 'none';
  resetGame();
  startGame();
}

function resetGame() {
  snake = [{ x: 250, y: 250 }];
  food = getRandomFoodPosition();
  dx = gridSize;
  dy = 0;
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
}

function startGame() {
  gameRunning = true;
  startGameBtn.style.display = 'none';
  gameInterval = setInterval(() => {
    if (!gameRunning) return;
    updateSnake();
    checkCollision();
    if (gameRunning) drawGame();
  }, 150);
}

document.addEventListener('keydown', e => {
  const key = e.key;
  if (key === 'ArrowUp' && dy === 0) {
    dx = 0; dy = -gridSize;
  } else if (key === 'ArrowDown' && dy === 0) {
    dx = 0; dy = gridSize;
  } else if (key === 'ArrowLeft' && dx === 0) {
    dx = -gridSize; dy = 0;
  } else if (key === 'ArrowRight' && dx === 0) {
    dx = gridSize; dy = 0;
  }
});

startGameBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

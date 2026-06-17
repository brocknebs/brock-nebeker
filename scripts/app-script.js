const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const gameOverScreen = document.getElementById("gameOverScreen");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let food;
let dx;
let dy;
let score;
let gameRunning = false;
let gameLoop;

function initializeGame() {
    snake = [
        { x: 10, y: 10 }
    ];

    food = {
        x: 15,
        y: 15
    };

    dx = 1;
    dy = 0;
    score = 0;

    scoreDisplay.textContent = score;

    gameOverScreen.style.display = "none";
}

function startGame() {
    initializeGame();

    startBtn.style.display = "none";
    gameRunning = true;

    clearInterval(gameLoop);
    gameLoop = setInterval(drawGame, 100);
}

function drawGame() {
    moveSnake();

    if (checkCollision()) {
        endGame();
        return;
    }

    clearBoard();
    drawFood();
    drawSnake();
}

function clearBoard() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "lime";

    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * gridSize,
            segment.y * gridSize,
            gridSize - 2,
            gridSize - 2
        );
    });
}

function drawFood() {
    ctx.fillStyle = "red";

    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize - 2,
        gridSize - 2
    );
}

function moveSnake() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function checkCollision() {
    const head = snake[0];

    // Wall collision
    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
    ) {
        return true;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {
            return true;
        }
    }

    return false;
}

function endGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    gameOverScreen.style.display = "block";
}

document.addEventListener("keydown", (event) => {

    if (!gameRunning) return;

    switch (event.key) {

        case "ArrowUp":
            event.preventDefault();
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;

        case "ArrowDown":
            event.preventDefault();
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;

        case "ArrowLeft":
            event.preventDefault();
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;

        case "ArrowRight":
            event.preventDefault();
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

startBtn.addEventListener("click", startGame);

retryBtn.addEventListener("click", () => {
    startGame();
});
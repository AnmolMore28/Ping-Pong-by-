const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Create the paddles
const paddleWidth = 10, paddleHeight = 60;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

// Create the ball
const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

// Keyboard input handling
let upPressed = false;
let downPressed = false;

// Score variables
let playerScore = 0;
let computerScore = 0;

// Game state variables
let isGamePaused = false;

// Handle keyboard input
function handleKeyDown(event) {
    if (event.key === 'ArrowUp') {
        upPressed = true;
    } else if (event.key === 'ArrowDown') {
        downPressed = true;
    } else if (event.key === 'p' || event.key === 'P') {
        togglePause();
    }
}

function handleKeyUp(event) {
    if (event.key === 'ArrowUp') {
        upPressed = false;
    } else if (event.key === 'ArrowDown') {
        downPressed = false;
    }
}

// Toggle game pause
function togglePause() {
    isGamePaused = !isGamePaused;

    if (isGamePaused) {
        cancelAnimationFrame(gameLoopID);
    } else {
        gameLoopID = requestAnimationFrame(gameLoop);
    }
}

// Update game state
function update() {
    if (isGamePaused) {
        return;
    }

    // Move the left paddle based on keyboard input
    if (upPressed && leftPaddleY > 0) {
        leftPaddleY -= 5;
    } else if (downPressed && leftPaddleY + paddleHeight < canvas.height) {
        leftPaddleY += 5;
    }

    // Move the right paddle (computer-controlled)
    const computerSpeed = 3;
    if (rightPaddleY + paddleHeight / 2 < ballY - ballSize / 4) {
        rightPaddleY += computerSpeed;
    } else if (rightPaddleY + paddleHeight / 2 > ballY + ballSize / 4) {
        rightPaddleY -= computerSpeed;
    }

    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce the ball off the top and bottom edges
    if (ballY - ballSize / 2 < 0 || ballY + ballSize / 2 > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Bounce the ball off the paddles
    if (
        (ballX - ballSize / 2 < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ||
        (ballX + ballSize / 2 > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Reset the ball if it goes beyond the paddles
    if (ballX - ballSize / 2 < 0) {
        computerScore++;
        resetGame();
    } else if (ballX + ballSize / 2 > canvas.width) {
        playerScore++;
        resetGame();
    }
}

// Reset the game state
function resetGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = Math.random() > 0.5 ? 5 : -5;
    ballSpeedY = Math.random() * 4 - 2; // Random vertical speed
    leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    rightPaddleY = canvas.height / 2 - paddleHeight / 2;

    // Check for game over
    if (playerScore === 3 || computerScore === 3) {
        showGameOver(playerScore === 3);
        playerScore = 0;
        computerScore = 0;
    }
}

// Render the game
function render() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Draw the ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();

    // Draw the score
    ctx.font = '20px Arial';
    ctx.fillText(`Player: ${playerScore}`, 50, 30);
    ctx.fillText(`Computer: ${computerScore}`, canvas.width - 170, 30);

    // Draw the pause icon
    if (isGamePaused) {
        ctx.font = '20px Arial';
        ctx.fillText('Game Paused', canvas.width / 2 - 80, canvas.height / 2 - 20);
    }
}

// Show game over message
function showGameOver(isPlayerWinner) {
    const message = isPlayerWinner ? 'You Win!' : 'Game Over. You Lost.';
    alert(message);
}

// Game loop
let gameLoopID;
function gameLoop() {
    update();
    render();
    gameLoopID = requestAnimationFrame(gameLoop);
}

// Set up event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Start the game loop
gameLoop();


// Start the game loop
gameLoop();

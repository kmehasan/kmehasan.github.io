// Define canvas dimensions and context
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

var canvasWidth = window.innerWidth - 20;
var canvasHeight = window.innerHeight - 20;
var snakeSize = 15; // set the size of each snake segment
console.log(canvasWidth)
console.log(canvasHeight)
 
canvasWidth = canvasWidth - canvasWidth%120;
canvasHeight = canvasHeight - canvasHeight%120;
console.log(canvasWidth)
console.log(canvasHeight)
canvas.width = canvasWidth;
canvas.height = canvasHeight;
// Define initial game state
let score = 0;
let snake = [
    { x: canvasWidth / 2, y: canvasHeight / 2 }, // head
    { x: canvasWidth / 2 - snakeSize, y: canvasHeight / 2 }, // body segment 1
    { x: canvasWidth / 2 - snakeSize*2, y: canvasHeight / 2 } // body segment 2
];
let direction = 'right';
let food = getRandomFoodPosition();
console.log(food)

// Define game loop
function gameLoop() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    if (isGameOver()) {
        // end game and show score
    } else {
        setTimeout(gameLoop, 100);
    }
    // check for collision with food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        handleFoodEaten(); // handle the food being eaten
    }
}

// Define functions for moving the snake and checking for collisions
function moveSnake() {
    // create new head position based on current direction
    let newHead;
    const head = snake[0];
    if (direction === 'right') {
        newHead = { x: head.x + snakeSize, y: head.y };
    } else if (direction === 'left') {
        newHead = { x: head.x - snakeSize, y: head.y };
    } else if (direction === 'up') {
        newHead = { x: head.x, y: head.y - snakeSize };
    } else if (direction === 'down') {
        newHead = { x: head.x, y: head.y + snakeSize };
    }

    // add new head to beginning of snake array
    snake.unshift(newHead);

    // remove tail segment
    snake.pop();
}

function isCollisionWithWall() {
    const head = snake[0];
    return (
        head.x < 0 ||
        head.x >= canvasWidth ||
        head.y < 0 ||
        head.y >= canvasHeight
    );
}
function isCollisionWithSelf() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}


// Define functions for drawing the snake and food
function drawSnake() {
    // draw each segment of the snake
    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = 'green';
        context.fillRect(snake[i].x, snake[i].y, snakeSize, snakeSize);

        // add border around each segment
        context.strokeStyle = 'black';
        context.strokeRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
    }
}

function drawFood() {
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, snakeSize, snakeSize);

    // add border around food
    context.strokeStyle = 'black';
    context.strokeRect(food.x, food.y, snakeSize, snakeSize);
}

function clearCanvas() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
}

// Define event listeners for changing direction
document.addEventListener('keydown', event => {
    if (event.keyCode === 37 && direction !== 'right') {
        direction = 'left';
    } else if (event.keyCode === 38 && direction !== 'down') {
        direction = 'up';
    } else if (event.keyCode === 39 && direction !== 'left') {
        direction = 'right';
    } else if (event.keyCode === 40 && direction !== 'up') {
        direction = 'down';
    }
});

// Define helper functions for generating random food positions and updating score
function getRandomFoodPosition() {
    let x = Math.floor(Math.random() * (canvasWidth / snakeSize)) * snakeSize;
    let y = Math.floor(Math.random() * (canvasHeight / snakeSize)) * snakeSize;
    return { x, y };
}
function handleFoodEaten() {
    snake.push({ x: food.x, y: food.y }); // add a new segment to the end of the snake
    updateScore(); // update the score
    spawnFood(); // spawn a new food
}

function updateScore() {
    score += 10; // increment score by 10 for each food eaten
    scoreElement.innerHTML = `Score: ${score}`;
}
function isGameOver() {
    return isCollisionWithSelf() || isCollisionWithWall(); // the snake is still alive
}
function spawnFood() {
    // generate random x and y coordinates within the canvas
    var x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    var y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;

    // check if the new food position overlaps with the snake
    for (var i = 0; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) {
            // if the new food position overlaps with the snake, generate new coordinates
            return spawnFood();
        }
    }

    // set the food position to the new coordinates
    food = { x: x, y: y };
}

// Start the game loop
gameLoop();

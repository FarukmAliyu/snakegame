// Initialize Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let snake;
let food;
let cursors;
let score = 0;
let scoreText;

function preload() {
    this.load.image('food', 'https://examples.phaser.io/assets/sprites/apple.png');
    this.load.image('body', 'https://examples.phaser.io/assets/sprites/block.png');
}

function create() {
    snake = this.physics.add.group();
    food = this.physics.add.group();

    // Create the initial snake body
    for (let i = 0; i < 3; i++) {
        let bodyPart = snake.create(100 + i * 16, 100, 'body');
        bodyPart.setOrigin(0);
    }

    // Create initial food
    createFood();

    // Set up cursors for controlling the snake
    cursors = this.input.keyboard.createCursorKeys();

    // Set up score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

    // Collide the snake with food
    this.physics.add.overlap(snake, food, eatFood, null, this);
}

function update() {
    let head = snake.getFirst(true);
    let tail = snake.getLast(true);

    if (cursors.left.isDown) {
        head.x -= 16;
    } else if (cursors.right.isDown) {
        head.x += 16;
    } else if (cursors.up.isDown) {
        head.y -= 16;
    } else if (cursors.down.isDown) {
        head.y += 16;
    }

    Phaser.Actions.ShiftPosition(snake.getChildren(), head.x, head.y, 1, tail);
}

function createFood() {
    let x = Phaser.Math.Between(0, 50) * 16;
    let y = Phaser.Math.Between(0, 37) * 16;
    food.create(x, y, 'food').setOrigin(0);
}

function eatFood(snakePart, foodPart) {
    foodPart.destroy();
    createFood();

    let tail = snake.getLast(true);
    let newPart = snake.create(tail.x, tail.y, 'body');
    newPart.setOrigin(0);

    score += 10;
    scoreText.setText('Score: ' + score);
}


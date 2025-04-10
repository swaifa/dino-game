const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let cup = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  vy: 0,
  gravity: 0.7,
  isJumping: false,
  jumpTimer: 0,
  jumpLength: 25,     // airtime (frames)
  jumpHeight: 5.5     // upward force per frame
};

let obstacles = [];
let score = 0;
let gameOver = false;
let obstacleTimer = 0;
const obstacleCooldown = 120;

let lastTime = 0; // Store the last timestamp
const maxFPS = 60; // Maximum 60 FPS

const cupImage = new Image();
cupImage.src = "cup.png";

const treeImage = new Image();
treeImage.src = "tree.png";

cupImage.onload = () => {
  treeImage.onload = () => {
    gameLoop(0); // Start the game loop
  };
};

function drawCup() {
  ctx.drawImage(cupImage, cup.x, cup.y, cup.width, cup.height);
}

function drawObstacle(ob) {
  ctx.drawImage(treeImage, ob.x, ob.y - 30, ob.width, ob.height + 30);
}

function update() {
  // Apply jump if in jump state
  if (cup.isJumping && cup.jumpTimer > 0) {
    cup.vy = -cup.jumpHeight;
    cup.jumpTimer--;
  }

  cup.vy += cup.gravity;
  cup.y += cup.vy;

  if (cup.y > 150) {
    cup.y = 150;
    cup.vy = 0;
    cup.isJumping = false;
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= 2.5;
    drawObstacle(obstacles[i]);

    if (
      cup.x < obstacles[i].x + obstacles[i].width &&
      cup.x + cup.width > obstacles[i].x &&
      cup.y < obstacles[i].y + obstacles[i].height &&
      cup.y + cup.height > obstacles[i].y
    ) {
      gameOver = true;
      alert("☕ You spilled the coffee!\nTry again before the code review starts...");
      document.location.reload();
    }
  }

  obstacles = obstacles.filter(ob => ob.x + ob.width > 0);

  obstacleTimer++;
  if (obstacleTimer >= obstacleCooldown) {
    obstacles.push({ x: canvas.width, y: 160, width: 40, height: 40 });
    obstacleTimer = 0;
  }

  drawCup();
  ctx.fillStyle = "#000";
  ctx.font = "14px monospace";
  ctx.fillText("Score: " + score, 10, 20);
  score++;
}

function gameLoop(timestamp) {
  // Limit the frame rate to maxFPS (60 frames per second)
  if (timestamp - lastTime < 1000 / maxFPS) return;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && cup.y >= 150) {
    cup.isJumping = true;
    cup.jumpTimer = cup.jumpLength;
  }
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let cup = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  vy: 0,
  gravity: 1.0,
  jumpPower: -15
};

let obstacles = [];
let score = 0;
let gameOver = false;

const cupImage = new Image();
cupImage.src = "cup.png";

const treeImage = new Image();
treeImage.src = "tree.png";

cupImage.onload = () => {
  treeImage.onload = () => {
    gameLoop();
  };
};

cupImage.onerror = () => alert("☕ cup.png not found!");
treeImage.onerror = () => alert("🌲 tree.png not found!");

function drawCup() {
  ctx.drawImage(cupImage, cup.x, cup.y, cup.width, cup.height);
}

function drawObstacle(ob) {
  ctx.drawImage(treeImage, ob.x, ob.y - 30, ob.width, ob.height + 30);
}

function update() {
  cup.vy += cup.gravity;
  cup.y += cup.vy;

  if (cup.y > 150) {
    cup.y = 150;
    cup.vy = 0;
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= 2.5;
    drawObstacle(obstacles[i]);

    // Collision detection
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

  // Remove off-screen obstacles
  obstacles = obstacles.filter(ob => ob.x + ob.width > 0);

  // Add new obstacles occasionally
  if (Math.random() < 0.012) {
    obstacles.push({ x: canvas.width, y: 160, width: 40, height: 40 });
  }

  drawCup();
  ctx.fillStyle = "#000";
  ctx.fillText("Score: " + score, 10, 20);
  score++;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function(e) {
  if (e.code === "Space" && cup.y >= 150) {
    cup.vy = cup.jumpPower;
  }
});

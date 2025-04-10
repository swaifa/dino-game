
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let cup = { x: 50, y: 150, width: 40, height: 40, vy: 0, gravity: 1.5, jumpPower: -20 };
let obstacles = [];
let gameOver = false;
let score = 0;

// Load coffee cup image
const cupImage = new Image();
cupImage.src = "assets/cup.png";

function drawCup() {
  ctx.drawImage(cupImage, cup.x, cup.y, cup.width, cup.height);
}

function drawObstacle(ob) {
  ctx.fillStyle = "#404040";
  ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
}

function update() {
  if (gameOver) return;

  cup.vy += cup.gravity;
  cup.y += cup.vy;
  if (cup.y > 150) {
    cup.y = 150;
    cup.vy = 0;
  }

  // Update and draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= 3; // Slowed down from 6 to 3
    drawObstacle(obstacles[i]);

    // Collision
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

  // Randomly add new obstacles
  if (Math.random() < 0.02) {
    let commitMessages = ["fix: typo", "wip: testing", "404", "refactor"];
    let msg = commitMessages[Math.floor(Math.random() * commitMessages.length)];
    obstacles.push({ x: canvas.width, y: 160, width: 50, height: 40, text: msg });
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

gameLoop();

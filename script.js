const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 100, y: 300, vy: 0, jumping: false, height: 40, width: 40 };
let gravity = 0.5;
let jumpPower = 0;
let isHolding = false;
let maxJumpPower = 12;
let obstacles = [];
let gameRunning = true;
let gameSpeed = 4;

function startGame() {
  player.y = 300;
  player.vy = 0;
  jumpPower = 0;
  isHolding = false;
  player.jumping = false;
  obstacles = [];
  gameRunning = true;
  document.getElementById("gameOver").style.display = "none";
  spawnObstacle();
  requestAnimationFrame(update);
}

function spawnObstacle() {
  const height = Math.floor(Math.random() * 100) + 50;
  obstacles.push({
    x: 800,
    y: 400 - height,
    width: 40,
    height: height
  });

  setTimeout(spawnObstacle, Math.random() * 2000 + 1000);
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply gravity
  if (player.jumping) {
    player.vy += gravity;
    player.y += player.vy;

    if (player.y >= 300) {
      player.y = 300;
      player.jumping = false;
      player.vy = 0;
    }
  }

  // Charge jump
  if (isHolding && !player.jumping) {
    jumpPower += 0.3;
    if (jumpPower > maxJumpPower) {
      endGame("You jumped too high!");
      return;
    }
  }

  // Draw player
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Move and draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= gameSpeed;

    ctx.fillStyle = "red";
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Collision check
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y + player.height > obs.y
    ) {
      endGame("You hit the wall!");
      return;
    }
  }

  requestAnimationFrame(update);
}

function endGame(message) {
  gameRunning = false;
  document.getElementById("gameOver").style.display = "block";
  document.getElementById("gameOver").innerHTML = `${message}<br><button onclick="startGame()">Try Again</button>`;
}

// Input handlers
document.addEventListener("keydown", e => {
  if (e.code === "Space" && !isHolding && !player.jumping) {
    isHolding = true;
    jumpPower = 0;
  }
});

document.addEventListener("keyup", e => {
  if (e.code === "Space" && isHolding && !player.jumping) {
    isHolding = false;
    player.vy = -jumpPower;
    player.jumping = true;
  }
});

startGame();

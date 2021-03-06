const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
let upKey;
let rightKey;
let downKey;
let leftKey;
let score = 0;
let player = {
  x: 75,
  y: 230,
  width: 20,
  height: 20,
  yv: 0,
  friction: 1,
  maxSpeed: 10,
  color: "#48ee67"
};
let bricks = [
  {
    x: 0,
    y: 0,
    width: 500,
    height: 20,
    color: "#ff0033"
  },
  {
    x: 0,
    y: 480,
    width: 500,
    height: 20,
    color: "#ff0033"
  }
];
let killerAIs = {
  color: "#ff4e4e",
  width: 20,
  height: 40,
  list: []
};
let lastTime = 0;
let killingCounter = 0;
let killingInterval = 2000;
function draw(time) {
  time = time ?? 0;
  let deltaTime = (time - lastTime);
  lastTime = time;
  killingCounter += deltaTime;
  clear();
  drawBricks();
  if (killingCounter > killingInterval) {
    createAIKiller();
    killingCounter = 0;
  }
  updateKillers();
  drawKillers();
  updatePlayer();
  drawPlayer();
  context.font = "25px Verdana, Geneva, Tahoma, sans-serif, serif";
  context.fillStyle = "#343434";
  context.fillText(`Score: ${score}`, 25, 45);
  requestAnimationFrame(draw);
}
function updateKillers() {
  killerAIs.list.forEach(function (item, i) {
    item.x -= 2.5;
    if (item.x < 0) {
      killerAIs.list.splice(i, 1);
      score += 1;
    }
  });
}
function drawKillers() {
  killerAIs.list.forEach(function (item) {
    context.fillStyle = killerAIs.color;
    context.fillRect(item.x, item.y, killerAIs.width, killerAIs.height);
  });
}
function createAIKiller() {
  killerAIs.list.push({
    x: 500,
    y: Math.floor(Math.random() * 500)
  });
  let index = (killerAIs.list.length - 1);
  let itemk = killerAIs.list[index];
  bricks.forEach(function (item) {
    if (itemk.y < (item.y + item.height) && (itemk.y + killerAIs.height) > item.y) {
      killerAIs.list.splice(index, 1);
    }
  });
}
function clear() {
  context.fillStyle = "#d0d0d0";
  context.fillRect(0, 0, canvas.width, canvas.height);
}
function drawBricks() {
  bricks.forEach(function (item) {
    context.fillStyle = item.color;
    context.fillRect(item.x, item.y, item.width, item.height);
  });
}
function updatePlayer() {
  if (upKey) {
    player.yv += -10;
  }
  player.yv += 1.25;
  if (player.yv > player.maxSpeed) {
    player.yv = player.maxSpeed;
  } else if (player.yv < -player.maxSpeed) {
    player.yv = -player.maxSpeed;
  }
  player.y += player.yv;
  bricks.forEach(function (item) {
    if (player.y < (item.y + item.height) && (player.y + killerAIs.height) > item.y) {
      reset();
    }
  });
  killerAIs.list.forEach(function (item) {
    if (player.x < (item.x + killerAIs.width) && (player.x + player.width) > item.x
    && player.y < (item.y + killerAIs.height) && (player.y + killerAIs.height) > item.y) {
      reset();
    }
  });
}
function reset() {
  player.y = 230;
  player.yv = 0;
  killerAIs.list = [];
  score = 0;
}
function drawPlayer() {
  context.fillStyle = player.color;
  context.fillRect(player.x, player.y, player.width, player.height);
}
document.addEventListener("keydown", function (event) {
  if (event.keyCode === 87 || event.keyCode === 38) { // w or up
    upKey = true;
  } else if (event.keyCode === 65 || event.keyCode === 37) { // a or left
    leftKey = true;
  } else if (event.keyCode === 83 || event.keyCode === 40) { // s or down
    downKey = true;
  } else if (event.keyCode === 68 || event.keyCode === 39) { // d or right
    rightKey = true;
  }
});
document.addEventListener("keyup", function (event) {
  if (event.keyCode === 87 || event.keyCode === 38) { // w or up
    upKey = false;
  } else if (event.keyCode === 65 || event.keyCode === 37) { // a or left
    leftKey = false;
  } else if (event.keyCode === 83 || event.keyCode === 40) { // s or down
    downKey = false;
  } else if (event.keyCode === 68 || event.keyCode === 39) { // d or right
    rightKey = false;
  }
});
draw();

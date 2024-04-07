import { Player } from "./creature.js";
import { Wave } from "./wave.js";
import { resolveCollision, boxCollision } from "./utils.js";
import { canvasConfig } from "./config.js";
//globals are created on module load
const player = new Player();
const waves = [];
setInterval(() => waves.push(new Wave(3, 100, player)), 500); //Simple wave system
setInterval(() => player.weapon.draw(), 500); //Simple wave system
function drawGame(ctx) {
  player.move(movement);
  player.draw(ctx);
  const totalEnemies = [];
  waves.forEach((wave) => {
    wave.draw(ctx);
    wave.moveEnemies(player);
    totalEnemies.push(...wave.enemies);
  });
  enemyCollision(totalEnemies);
}

const enemyCollision = (enemies) => {
  enemies.forEach((enemy1) => {
    enemies.forEach((enemy2) => {
      if (enemy1 !== enemy2 && boxCollision(enemy1, enemy2)) {
        resolveCollision(enemy1, enemy2);
      }
    });
  });
};
const movement = {
  moveLeft: false,
  moveRight: false,
  moveUp: false,
  moveDown: false,
  attack: false,
};
export function toggleMovement(event, activate) {
  const key = event.code;
  if (key === "ArrowLeft") {
    movement.moveLeft = activate;
  } else if (key === "ArrowRight") {
    movement.moveRight = activate;
  } else if (key === "ArrowUp") {
    movement.moveUp = activate;
  } else if (key === "ArrowDown") {
    movement.moveDown = activate;
  } else if (key === "KeyZ") {
    movement.attack = activate;
  }
}
export function game(ctx) {
  //Camera follows player
  let y = -player.yPos + canvasConfig.height / 2;
  let x = -player.xPos + canvasConfig.width / 2;
  ctx.save();
  ctx.translate(x, y);
  drawGame(ctx);
  ctx.restore();
}

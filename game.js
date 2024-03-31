import { Player, Enemy } from "./creature.js";
import { Wave } from "./wave.js";
import { canvasConfig } from "./config.js";
//globals are created on module load
const player = new Player();
const wave = new Wave(5, 100);

function drawGame(ctx) {
  player.move(movement);
  player.draw(ctx);
  wave.draw(ctx);
  wave.moveEnemies(player);
}
const movement = {
  moveLeft: false,
  moveRight: false,
  moveUp: false,
  moveDown: false,
};
export function toggleMovement(event, activate) {
  const key = event.key;
  if (key === "ArrowLeft") {
    movement.moveLeft = activate;
  } else if (key === "ArrowRight") {
    movement.moveRight = activate;
  } else if (key === "ArrowUp") {
    movement.moveUp = activate;
  } else if (key === "ArrowDown") {
    movement.moveDown = activate;
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

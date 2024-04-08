import { Player } from "./entities/creature.js";
import { Wave } from "./wave.js";
import { canvasConfig } from "./config/config.js";
//globals are created on module load
export const player = new Player();
const waves = [];
setInterval(() => waves.push(new Wave(3, 100, player)), 500); //Simple wave system
function drawGame(ctx) {
  player.move();
  player.draw(ctx);
  const totalEnemies = [];
  waves.forEach((wave) => {
    wave.draw(ctx);
    wave.moveEnemies(player);
    totalEnemies.push(...wave.enemies);
  });
  enemyCollision(totalEnemies);
}

/**
 * @param {Enemy[]} enemies
 */
const enemyCollision = (enemies) => {
  enemies.forEach((enemy1) => {
    enemies.forEach((enemy2) => {
      enemy1.collisionDetectAndResolve(enemy2);
    });
  });
};

export function camera(ctx) {
  //Camera follows player
  let y = -player.yPos + canvasConfig.height / 2;
  let x = -player.xPos + canvasConfig.width / 2;
  ctx.save();
  ctx.translate(x, y);
  drawGame(ctx);
  ctx.restore();
}

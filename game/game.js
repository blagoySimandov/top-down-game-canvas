import { Player } from "./entities/creature.js";
import { Map } from "./map/map.js";

import { Wave } from "./wave.js";
import { canvasConfig } from "./config/config.js";
import { Camera, Viewport } from "./viewport/viewport.js";
//globals are created on module load
export const player = new Player(525, 375, 20, 30);
const map = new Map();
const camera = new Camera(player);
const waves = [];

setInterval(() => waves.push(new Wave(3, 100, player)), 500); //Simple wave system
function drawGame(ctx, viewport) {
  player.move();
  player.draw(ctx, viewport);
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

export function game(ctx) {
  camera.update();
  map.drawMap(ctx, camera.viewport);
  ctx.save();
  ctx.translate(-camera.viewport.x, -camera.viewport.y);
  drawGame(ctx, camera.viewport);
  camera.viewport.draw(ctx);
  ctx.restore();
}

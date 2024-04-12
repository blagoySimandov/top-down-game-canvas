import { Player } from "./entities/creature.js";
import { Map } from "./map/map.js";
import { assets } from "./animation/assets.js";
import { Wave } from "./wave.js";
import { Camera } from "./viewport/camera.js";

//globals are created on module load
//Should be in factory, but im lazy.
const player = new Player(525, 375, 70, 100, 10, assets.get("playerMovement"));
//since js passes things by pointer instead of value the line below is correct.
export const playerMovement = player.movement;
const map = new Map();
const camera = new Camera(player);
const waves = [];
setInterval(() => waves.push(new Wave(1, 100, player)), 100); //Simple wave system
function drawGame(ctx, viewport) {
  player.update();
  player.draw(ctx, viewport);
  // const totalEnemies = [];
  // waves.forEach((wave) => {
  //   wave.draw(ctx);
  //   wave.moveEnemies(player);
  //   totalEnemies.push(...wave.enemies);
  // });
  // enemyCollision(totalEnemies);
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
  camera.update(map.mapWidth, map.mapHeight);
  ctx.save();
  //easier to manage with translate
  map.drawMap(ctx, camera.viewport);
  ctx.translate(-camera.viewport.x, -camera.viewport.y);
  drawGame(ctx, camera.viewport);
  camera.viewport.draw(ctx);
  ctx.restore();
}

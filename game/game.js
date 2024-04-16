import { Player } from "./entities/creature.js";
import { Map } from "./map/map.js";
import { assets } from "./draw/assets.js";
import { Wave } from "./wave.js";
import { Camera } from "./viewport/camera.js";
import { Cursor } from "./cursor/cursor.js";

//globals are created on module load
//Should be in factory, but im lazy.
const player = new Player(525, 375, 70, 100, 10, assets.get("playerMovement"));
export const playerMovement = player.movement;
const weapon = player.weapon;
const map = new Map();
const camera = new Camera(player);
const waves = [];
/**
 * @type{[Bullet]}
 */
const bullets = [];
export const cursor = new Cursor(weapon);
setInterval(() => waves.push(new Wave(3, 100, player)), 3000); //Simple wave system
function gameLogic(ctx, viewport) {
  bullets.forEach((bullet, index) => {
    if (!bullet.isOutOfBounds(viewport)) {
      bullet.draw(ctx);
      bullet.updatePosition();
    } else {
      bullets.splice(index, 1);
    }
  });

  player.draw(ctx, viewport, cursor);

  cursor.setGamePos(cursor.x + camera.viewport.x, cursor.y + camera.viewport.y);
  cursor.draw(ctx);
  player.update(cursor, bullets);

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
  camera.update(map.mapWidth, map.mapHeight);
  ctx.save();
  //easier to manage with translate
  map.drawMap(ctx, camera.viewport);
  ctx.translate(-camera.viewport.x, -camera.viewport.y);
  gameLogic(ctx, camera.viewport);
  camera.viewport.draw(ctx);
  ctx.restore();
}

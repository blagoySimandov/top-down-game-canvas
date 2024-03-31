import { Enemy } from "./creature.js";
import { boxCollision, resolveCollision } from "./utils.js";
export class Wave {
  /**@param {int} timeInterval - the interval of time for which the wave is active in seconds*/
  constructor(enemyCount, timeInterval) {
    this.enemyCount = enemyCount;
    this.enemies = Array.from({ length: enemyCount }, (_, k) => Enemy.spawn(k));
    this.timeInterval = timeInterval;
  }
  destroyEnemy(id) {
    delete this.enemies[id];
  }
  draw(ctx) {
    this.enemies.forEach((enemy) => {
      enemy.draw(ctx);
    });
  }
  moveEnemies(player) {
    this.enemies.forEach((enemy) => {
      enemy.move(player.xPos, player.yPos);
    });
    this.enemies.forEach((enemy1) => {
      this.enemies.forEach((enemy2) => {
        if (enemy1 !== enemy2 && boxCollision(enemy1, enemy2)) {
          resolveCollision(enemy1, enemy2);
        }
      });
    });
  }
}

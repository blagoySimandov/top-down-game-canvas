import { Enemy } from "./creature.js";
export class Wave {
  /**@param {int} timeInterval - the interval of time for which the wave is active in seconds*/
  constructor(enemyCount, timeInterval, player) {
    this.enemyCount = enemyCount;
    this.enemies = Array.from({ length: enemyCount }, (_, k) =>
      Enemy.spawn(k, player)
    );
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
  }
}

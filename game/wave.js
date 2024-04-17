import { Enemy } from "./entities/creature.js";
export class Wave {
  /**@param {int} timeInterval - the interval of time for which the wave is active in seconds*/
  constructor(enemyCount, timeInterval, player) {
    this.enemyCount = enemyCount;
    this.enemies = Array.from({ length: enemyCount }, (_, k) =>
      Enemy.spawn(k, player)
    );
    this.timeInterval = timeInterval;
  }
  draw(ctx) {
    this.enemies.forEach((enemy) => {
      enemy.draw(ctx);
    });
  }
  /**@param {Player} player */
  update(player) {
    this.enemies.forEach((enemy) => {
      enemy.update(player.movement.xPos, player.movement.yPos);
    });
  }
}

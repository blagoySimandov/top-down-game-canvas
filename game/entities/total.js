import { Enemy } from "./creature.js";
//Typed array of bullets
export class TotalBullets extends Array {
  constructor(...args) {
    super(...args);
  }
  /**
   * @returns {int} score - the collection of all collected in this frame.
   */
  updateBullets(ctx, viewport, totalEnemies) {
    let score = 0;
    this.forEach((bullet, index) => {
      if (
        !bullet.active &&
        bullet.deathAnimation.currentFrame === bullet.deathAnimation.maxFrame
      ) {
        this.splice(index, 1);
      }
      if (!bullet.isOutOfBounds(viewport)) {
        bullet.draw(ctx);
        bullet.updatePosition();

        let enemiesHit = bullet.collidesWithEnemies(totalEnemies);
        enemiesHit.forEach((enemyIndex) => {
          let affectedEnemy = totalEnemies.at(enemyIndex);
          if (affectedEnemy.active && bullet.active) {
            totalEnemies.subtractHpAtIndex(enemyIndex, bullet.dmg);
            if (affectedEnemy.hp <= 0) {
              affectedEnemy.active = false;
              score += affectedEnemy.score;
            }
          }
        });
        if (enemiesHit.length) {
          bullet.active = false;
        }
      } else {
        this.splice(index, 1);
      }
    });
    return score;
  }
}

export class TotalEnemies extends Array {
  constructor(player, ...args) {
    super(...args);
    this.enemyId = 0;
    let timeInterval = 1000;
    setInterval(() => {
      timeInterval -= 10;
    }, 3000);
    //not exactly pretty...
    setInterval(() => {
      this.spawnEnemy(player);
      this.enemyId++;
    }, timeInterval);
  }
  enemyCollision(enemy1) {
    if (!enemy1.active) return;
    this.forEach((enemy2) => {
      if (!enemy2.active) return;
      enemy1.collisionDetectAndResolve(enemy2);
    });
  }
  subtractHpAtIndex(idx, dmg) {
    this.at(idx).lowerHp(dmg);
  }
  removeEnemyAtIndex(index) {
    this.splice(index, 1);
  }
  drawAndUpdateEnemies(ctx, player) {
    this.forEach((enemy, idx) => {
      if (
        !enemy.active &&
        enemy.deathAnimation.currentFrame + 1 === enemy.deathAnimation.maxFrame
      ) {
        this.removeEnemyAtIndex(idx);
      }
      if (
        enemy.active &&
        //Im so sorry for the 5 lines below.
        enemy.collisionDetect({
          movement: {
            xPos: player.cx,
            yPos: player.cy,
          },
          width: player.width,
          height: player.height,
        })
      ) {
        player.lowerHp(enemy.dmg);
      }
      enemy.draw(ctx);
      enemy.update(player.movement.xPos, player.movement.yPos, player.active);
      this.enemyCollision(enemy);
    });
  }

  spawnEnemy(player) {
    this.push(Enemy.spawn(this.enemyId, player));
  }
}

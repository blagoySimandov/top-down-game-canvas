import { canvasConfig } from "../config/config.js";
import {
  PlayerMovement,
  EnemyMovement,
  Movement,
} from "../movement/movement.js";
import { resolveCollision, boxCollision } from "../utils.js";
import { Animation } from "../animation/animation.js";
import { Weapon } from "./weapon.js";
import { getRandomInt } from "../utils.js";
export class Creature {
  /**
   * @param {int} width - width of the creature
   * @param {int} height - height of the creature
   * @param {Movement} movement - movement logic and position.
   * @param {Image} sprite - Sprite with which to draw the entity.
   */
  constructor(width, height, movement, sprite) {
    this.width = width || 20;
    this.height = height || 30;
    this.movement = movement;
    this.sprite = sprite;
  } //center x
  get cx() {
    return this.movement.xPos + this.width * 0.5;
  } //center y
  get cy() {
    return this.movement.yPos + this.height * 0.5;
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    if (this.sprite) {
      ctx.drawRect(
        this.sprite,
        this.movement.xPos,
        this.movement.yPos,
        this.width,
        this.height
      );
    } else {
      ctx.fillRect(
        this.movement.xPos,
        this.movement.yPos,
        this.width,
        this.height
      );
    }
  }
}

export class Enemy extends Creature {
  constructor({ xPos, yPos, width, height, id }, speed) {
    const movemementSpeed = speed || 10;
    const enemyMovementAnimation = new Animation(null, {});
    const movement = new EnemyMovement(
      movemementSpeed,
      enemyMovementAnimation,
      xPos,
      yPos
    );
    super(width, height, movement);
    this.color = "red";
    this.id = id || -1;
  }
  /**
   * @param {Enemy} enemy
   * @description Takes an enemy as an arguments, hecks collison and resolves that collison if needed
   */
  collisionDetectAndResolve(enemy) {
    if (this !== enemy && boxCollision(this, enemy)) {
      resolveCollision(this, enemy);
    }
  }

  /** spawns and enemy at a random postion on the edge of the screen*/
  /**Should move it in a factory. //Don't have time for this now. Will do it later. (probably ;d)// */
  static spawn(id, player) {
    const side = Math.floor(Math.random() * 4);
    const enemyWidth = 20;
    const enemyHeight = 30;
    let xPos, yPos;
    let xRandom = getRandomInt(
      player.movement.xPos - canvasConfig.width / 2,
      player.movement.xPos + canvasConfig.width / 2
    );
    let yRandom = getRandomInt(
      player.movement.yPos - canvasConfig.height / 2,
      player.movement.yPos + canvasConfig.height / 2
    );
    let rightBound = Math.floor(player.movement.xPos + canvasConfig.width / 2);
    let leftBound = Math.floor(player.movement.xPos - canvasConfig.width / 2);
    let topBound = Math.floor(player.movement.yPos + canvasConfig.height / 2);
    let bottomBound = Math.floor(
      player.movement.yPos - canvasConfig.height / 2
    );
    const offset = 300;
    switch (side) {
      case 0: // Top side
        xPos = xRandom;
        yPos = topBound + offset;
        break;
      case 1: // Right side
        xPos = rightBound + enemyWidth + offset;
        yPos = yRandom;
        break;
      case 2: // Bottom side
        xPos = xRandom;
        yPos = bottomBound - enemyHeight - offset;
        break;
      case 3: // Left side
        xPos = leftBound - offset;
        yPos = yRandom;
        break;
    }
    return new Enemy({ xPos: xPos, yPos: yPos, id: id }, 5);
  }
}
export class Player extends Creature {
  constructor(xPos, yPos, width, height, speed, sprite) {
    const movement = new PlayerMovement(speed, xPos, yPos);
    super(width, height, movement, sprite);
    this.drawler = null;
    this.weapon = new Weapon(10, 1);
  }

  update() {
    const [dx, dy, drawler] = this.movement.move();
    this.drawler = drawler;
    this.movement.incrementPosition(dx, dy);
  }
  draw(ctx, viewport) {
    let drawX = this.cx;
    let drawY = this.cy;
    if (viewport.followingX) {
      drawX = viewport.x + viewport.w / 2;
    }
    if (viewport.followingY) {
      drawY = viewport.y + viewport.h / 2;
    }
    this.drawler(ctx, drawX, drawY, this.width, this.height);
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; // Transparent black color

    ctx.ellipse(
      drawX + this.width / 2,
      drawY + this.height,
      this.width / 2,
      this.height / 6,
      0,
      0,
      Math.PI * 2
    ); // Adjust the parameters as needed
    ctx.fill();
  }
}

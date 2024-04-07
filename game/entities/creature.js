import { Orientation, canvasConfig } from "../config/config.js";
import { Weapon } from "./weapon.js";
import { getRandomInt } from "../utils.js";
export class Creature {
  constructor(xPos, yPos, width, height, speed, color, orien) {
    this.xPos = xPos || 500;
    this.yPos = yPos || 350;
    this.width = width || 20;
    this.orientation = this.height = height || 30;
    this.speed = speed || 10;
    this.color = color || "red";
    this.orientation = Orientation[orien] || Orientation.left;
  }
  //center x
  get cx() {
    return this.xPos + this.width * 0.5;
  } //center y
  get cy() {
    return this.yPos + this.height * 0.5;
  }
  changeDirection(dx, dy) {
    let xDir = 0;
    let yDir = 0;
    if (dx === 0) {
      xDir = 0;
    } else {
      xDir = dx > 0 ? Orientation.left : Orientation.right;
    }

    if (dy === 0) {
      yDir = 0;
    } else {
      yDir = dy > 0 ? Orientation.down : Orientation.up;
    }

    let orien = xDir | yDir; //open config.js for explations
    this.orientation = orien;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
  }
}
function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

export class Enemy extends Creature {
  constructor({ xPos, yPos, width, height, id }) {
    super(xPos, yPos, width, height);
    this.speed = 5;
    this.id = id || -1;
  }
  /**moves the enemy towards a certain position. Used for chasing the player
   * @param {int} x
   * @param {int} y
   */
  move(x, y) {
    const dx = x - this.xPos;
    const dy = y - this.yPos;
    this.changeDirection(dx, dy);
    const distance = Math.sqrt(dx * dx + dy * dy);

    const step = this.speed / distance;
    this.xPos += dx * step;
    this.yPos += dy * step;
  }

  /** spawns and enemy at a random postion on the edge of the screen*/
  static spawn(id, player) {
    const side = Math.floor(Math.random() * 4);
    const enemyWidth = 20;
    const enemyHeight = 30;
    let xPos, yPos;
    let xRandom = getRandomInt(
      player.xPos - canvasConfig.width / 2,
      player.xPos + canvasConfig.width / 2
    );
    let yRandom = getRandomInt(
      player.yPos - canvasConfig.height / 2,
      player.yPos + canvasConfig.height / 2
    );
    let rightBound = Math.floor(player.xPos + canvasConfig.width / 2);
    let leftBound = Math.floor(player.xPos - canvasConfig.width / 2);
    let topBound = Math.floor(player.yPos + canvasConfig.height / 2);
    let bottomBound = Math.floor(player.yPos - canvasConfig.height / 2);
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
    return new Enemy({ xPos: xPos, yPos: yPos, id: id });
  }
}

export class Player extends Creature {
  constructor(xPos, yPos, width, height, orien) {
    super(xPos, yPos, width, height, orien);
    this.speed = 10;
    this.color = "green";
    this.weapon = new Weapon(10, 1);
  }
  move(movement) {
    let tempspeed =
      movement.moveLeft || movement.moveRight
        ? movement.moveUp || movement.moveDown
          ? this.speed * 0.71 // diagonal speed correction
          : this.speed
        : this.speed;
    let dx = 0;
    let dy = 0;
    if (movement.moveLeft) {
      dx = -tempspeed;
    }
    if (movement.moveRight) {
      dx = tempspeed;
    }
    if (movement.moveUp) {
      dy = -tempspeed;
    }
    if (movement.moveDown) {
      dy = tempspeed;
    }
    this.xPos += dx;
    this.yPos += dy;

    if (!(dx === 0 && dy === 0)) this.changeDirection(dx, dy);
  }
  draw(ctx) {
    super.draw(ctx);
  }
}

import { canvasConfig } from "./config.js";
export class Creature {
  constructor(xPos, yPos, width, height, speed, color) {
    this.xPos = xPos || 500;
    this.yPos = yPos || 350;
    this.width = width || 20;
    this.height = height || 30;
    this.speed = speed || 10;
    this.color = color || "red";
  }
  //center x
  get cx() {
    return this.xPos + this.width * 0.5;
  }
  //center y
  get cy() {
    return this.yPos + this.height * 0.5;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
  }
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

    const distance = Math.sqrt(dx * dx + dy * dy);

    const step = this.speed / distance;

    this.xPos += dx * step;
    this.yPos += dy * step;
  }

  /** spawns and enemy at a random postion on the edge of the screen*/
  static spawn(id) {
    const side = Math.floor(Math.random() * 4);
    const enemyWidth = 20;
    const enemyHeight = 30;
    let xPos, yPos;

    switch (side) {
      case 0: // Top side
        xPos = Math.random() * canvasConfig.width;
        yPos = 0;
        break;
      case 1: // Right side
        xPos = canvasConfig.width - enemyWidth;
        yPos = Math.random() * canvasConfig.height;
        break;
      case 2: // Bottom side
        xPos = Math.random() * canvasConfig.width;
        yPos = canvasConfig.height - enemyHeight;
        break;
      case 3: // Left side
        xPos = 0;
        yPos = Math.random() * canvasConfig.height;
        break;
    }
    return new Enemy({ xPos: xPos, yPos: yPos, id: id });
  }
}

export class Player extends Creature {
  constructor(xPos, yPos, width, height) {
    super(xPos, yPos, width, height);
    this.speed = 10;
    this.color = "green";
  }
  move(movement) {
    let tempspeed =
      movement.moveLeft || movement.moveRight
        ? movement.moveUp || movement.moveDown
          ? this.speed * 0.71 // diagonal speed correction
          : this.speed
        : this.speed;

    if (movement.moveLeft) {
      this.xPos -= tempspeed;
    }
    if (movement.moveRight) {
      this.xPos += tempspeed;
    }
    if (movement.moveUp) {
      this.yPos -= tempspeed;
    }
    if (movement.moveDown) {
      this.yPos += tempspeed;
    }
  }
}

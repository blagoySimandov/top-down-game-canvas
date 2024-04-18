import { Orientation } from "../config/config.js";
import { Vector } from "./vector.js";
export class Movement {
  /**
   *@param {int} speed - the speed of the movement
   **/
  constructor(speed, xPos, yPos, orien) {
    this.speed = speed;
    this.xPos = xPos;
    this.yPos = yPos;
    this.dx = 0;
    this.dy = 0;
    this.orientation = Orientation[orien] || Orientation.left;
  }
  move() {
    console.error("Not Implemented");
  }
  incrementPosition() {
    this.xPos += this.dx;
    this.yPos += this.dy;
  }
  changeDirection(dx) {
    if (dx !== 0) {
      const xDir = dx > 0 ? Orientation.right : Orientation.left;
      this.orientation = xDir;
    }
  }
  changeDirectionByFollowX(x) {
    if (x < this.xPos) {
      this.orientation = Orientation.left;
    } else if (x > this.xPos) {
      this.orientation = Orientation.right;
    }
  }
}

export class EnemyMovement extends Movement {
  constructor(speed, xPos, yPos, orien) {
    //orien has default
    super(speed, xPos, yPos, orien);
  }
  /**moves the enemy towards a certain position. Used for chasing the player
   * @param {int} x
   * @param {int} y
   */

  follow(x, y) {
    const direction = new Vector(this.xPos, this.yPos, x, y).normalized;
    this.dx = direction.targetX * this.speed;
    this.dy = direction.targetY * this.speed;
    this.changeDirectionByFollowX(x);
    return [this.dx, this.dy]; //not sure why im returning them instead of acessing them but seems cleaner this way (not sure.?)
  }
}
export class PlayerMovement extends Movement {
  constructor(speed, xPos, yPos, orien) {
    super(speed, xPos, yPos, orien);
    //prob should be a const at the top.
    this.movementKeys = {
      moveLeft: false,
      moveRight: false,
      moveUp: false,
      moveDown: false,
      attack: false,
    };
  }

  toggleMovement(event, activate) {
    const key = event.code;
    if (key === "KeyA") {
      this.movementKeys.moveLeft = activate;
    } else if (key === "KeyD") {
      this.movementKeys.moveRight = activate;
    } else if (key === "KeyW") {
      this.movementKeys.moveUp = activate;
    } else if (key === "KeyS") {
      this.movementKeys.moveDown = activate;
    } else if (key === "KeyZ") {
      this.movementKeys.attack = activate;
    }
  }
  changeDirectionByFollowX(cursorX) {
    if (cursorX < this.xPos) {
      this.orientation = Orientation.left;
    } else if (cursorX > this.xPos) {
      this.orientation = Orientation.right;
    }
  }
  incrementPlayerPosition(mapWidth, mapHeight) {
    const nextX = this.xPos + this.dx;
    const nextY = this.yPos + this.dy;

    if (nextX >= 0 && nextX < mapWidth) {
      this.xPos = nextX;
    }
    if (nextY >= 0 && nextY < mapHeight) {
      this.yPos = nextY;
    }
  }

  move(mapDimensions, active) {
    if (!active) return [0, 0];
    [this.dx, this.dy] = this.getPosChange();
    this.incrementPosition(mapDimensions[0], mapDimensions[1]);
    return [this.dx, this.dy];
  }

  getPosChange() {
    let dx = 0;
    let dy = 0;

    if (this.movementKeys.moveLeft) {
      dx -= this.speed;
    }
    if (this.movementKeys.moveRight) {
      dx += this.speed;
    }
    if (this.movementKeys.moveUp) {
      dy -= this.speed;
    }
    if (this.movementKeys.moveDown) {
      dy += this.speed;
    }

    if (dx !== 0 && dy !== 0) {
      const diagonalSpeed = (this.speed * Math.sqrt(2)) / 2;
      dx *= diagonalSpeed / this.speed;
      dy *= diagonalSpeed / this.speed;
    }

    return [dx, dy];
  }
}

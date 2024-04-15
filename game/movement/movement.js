import { Orientation } from "../config/config.js";
import { Animation, OrientedAnimation } from "../draw/animation.js";
import { assets } from "../draw/assets.js";
import { Vector } from "./vector.js";
export class Movement {
  /**
   *@param {int} speed - the speed of the movement
   *@param {OrientedAnimation} moveAnimation - collection of left and Right animations for the movement*/
  constructor(speed, moveAnimation, xPos, yPos, orien, idleAnimation) {
    this.moveAnimation = moveAnimation;
    this.moveAnimation.Prototype;
    this.idleAnimation = idleAnimation;
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
}

export class EnemyMovement extends Movement {
  constructor(speed, animation, xPos, yPos, orien) {
    super(speed, animation, xPos, yPos, orien);
  }
  /**moves the enemy towards a certain position. Used for chasing the player
   * @param {int} x
   * @param {int} y
   */

  follow(x, y) {
    const direction = new Vector(this.xPos, this.yPos, x, y).normalized;
    this.dx = direction.targetX * this.speed;
    this.dy = direction.targetY * this.speed;
    this.incrementPosition();
  }
}
export class PlayerMovement extends Movement {
  constructor(speed, xPos, yPos, orien) {
    const plMovementAnimationRight = new Animation(
      assets.get("playerMovementRight"),
      {
        frames: 8,
        currentFrame: 0,
        skippedFrames: 3,
      }
    );
    const plMovementAnimationLeft = new Animation(
      assets.get("playerMovementLeft"),
      {
        frames: 8,
        currentFrame: 0,
        skippedFrames: 3,
      }
    );
    const moveAnimations = new OrientedAnimation(
      plMovementAnimationLeft,
      plMovementAnimationRight
    );

    const plIdleAnimationRight = new Animation(assets.get("playerIdleRight"), {
      frames: 6,
      skippedFrames: 8,
      currentFrame: 0,
    });
    const plIdleAnimationLeft = new Animation(assets.get("playerIdleLeft"), {
      frames: 6,
      skippedFrames: 8,
      currentFrame: 0,
    });
    const idleAnimations = new OrientedAnimation(
      plIdleAnimationLeft,
      plIdleAnimationRight
    );
    super(speed, moveAnimations, xPos, yPos, orien, idleAnimations);
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
    if (key === "ArrowLeft") {
      this.movementKeys.moveLeft = activate;
    } else if (key === "ArrowRight") {
      this.movementKeys.moveRight = activate;
    } else if (key === "ArrowUp") {
      this.movementKeys.moveUp = activate;
    } else if (key === "ArrowDown") {
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
  move() {
    [this.dx, this.dy] = this.getPosChange();
    this.incrementPosition();
    if (this.dx === 0 && this.dy === 0) {
      const drawer =
        this.idleAnimation[
          this.orientation === Orientation.right ? "rightAnim" : "leftAnim"
        ].getAnimationDrawer();
      return [this.dx, this.dy, drawer];
    }
    const drawer =
      this.moveAnimation[
        this.orientation === Orientation.right ? "rightAnim" : "leftAnim"
      ].getAnimationDrawer();

    return [this.dx, this.dy, drawer];
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

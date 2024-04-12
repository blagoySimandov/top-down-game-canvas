import { Orientation } from "../config/config.js";
import { Animation, OrientedAnimation } from "../animation/animation.js";
import { assets } from "../animation/assets.js";
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
    this.orientation = Orientation[orien] || Orientation.left;
  }
  move() {
    console.error("Not Implemented");
  }
  incrementPosition(dx, dy) {
    this.xPos += dx;
    this.yPos += dy;
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
    let dx = x - this.xPos;
    let dy = y - this.yPos;
    this.changeDirection(dx);
    const distance = Math.sqrt(dx * dx + dy * dy);

    const step = this.speed / distance;
    dx = dx * step;
    dy = dy * step;
    this.incrementPosition(dx, dy);
  }
}
export class PlayerMovement extends Movement {
  constructor(speed, xPos, yPos, orien) {
    const plMovementAnimationRight = new Animation(
      assets.get("playerMovementRight"),
      {
        frames: 8,
        currentFrame: 0,
        skippedFrames: 0,
      }
    );
    const plMovementAnimationLeft = new Animation(
      assets.get("playerMovementLeft"),
      {
        frames: 8,
        currentFrame: 0,
        skippedFrames: 0,
      }
    );
    const moveAnimations = new OrientedAnimation(
      plMovementAnimationLeft,
      plMovementAnimationRight
    );

    const plIdleAnimationRight = new Animation(assets.get("playerIdleRight"), {
      frames: 6,
      skippedFrames: 4,
      currentFrame: 0,
    });
    const plIdleAnimationLeft = new Animation(assets.get("playerIdleLeft"), {
      frames: 6,
      skippedFrames: 4,
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
  move() {
    let tempspeed =
      this.movementKeys.moveLeft || this.movementKeys.moveRight
        ? this.movementKeys.moveUp || this.movementKeys.moveDown
          ? this.speed * 0.71 // diagonal speed correction
          : this.speed
        : this.speed;
    let dx = 0;
    let dy = 0;
    if (this.movementKeys.moveLeft) {
      dx = -tempspeed;
    }
    if (this.movementKeys.moveRight) {
      dx = tempspeed;
    }
    if (this.movementKeys.moveUp) {
      dy = -tempspeed;
    }
    if (this.movementKeys.moveDown) {
      dy = tempspeed;
    }
    if (dx === 0 && dy === 0) {
      const drawler =
        this.orientation === Orientation.right
          ? this.idleAnimation.rightAnim.getAnimationDrawler()
          : this.idleAnimation.leftAnim.getAnimationDrawler();
      return [dx, dy, drawler];
    }
    super.changeDirection(dx);
    const drawler =
      this.orientation === Orientation.right
        ? this.moveAnimation.rightAnim.getAnimationDrawler()
        : this.moveAnimation.leftAnim.getAnimationDrawler();
    return [dx, dy, drawler];
  }
}

import { Orientation, canvasConfig } from "../config/config.js";
import { assets } from "../draw/assets.js";
import {
  PlayerMovement,
  EnemyMovement,
  Movement,
} from "../movement/movement.js";
import { resolveCollision, boxCollision } from "../utils.js";
import { Animation, OrientedAnimation } from "../draw/animation.js";
import { Rifle } from "./weapon.js";
import { getRandomInt } from "../utils.js";
import { TotalEnemies } from "./total.js";
export class Creature {
  /**
   * @param {int} width - width of the creature
   * @param {int} height - height of the creature
   * @param {Movement} movement - movement logic and position.
   * @param {Image} sprite - Sprite with which to draw the entity.
   */
  constructor(
    width,
    height,
    movement,
    moveAnimation,
    idleAnimation,
    hp,
    active,
    deathAnimation
  ) {
    this.width = width || 20;
    this.height = height || 30;
    this.movement = movement;
    this.moveAnimation = moveAnimation;
    this.idleAnimation = idleAnimation;
    this.hp = hp;
    this.maxhp = hp;
    this.deathAnimation = deathAnimation;
    this.active = active;
    this.drawer = null; //will get overridden; adding it here for the sake of docs
  } //center x
  get cx() {
    return this.movement.xPos - this.width / 2;
  } //center y
  get cy() {
    return this.movement.yPos - this.height / 2;
  }
  getCorrectOrientedDrawer(dx, dy, debug) {
    let drawer;
    if (dx === 0 && dy === 0) {
      drawer =
        this.idleAnimation[
          this.movement.orientation === Orientation.right
            ? "rightAnim"
            : "leftAnim"
        ].getAnimationDrawer();
    } else {
      drawer =
        this.moveAnimation[
          this.movement.orientation === Orientation.right
            ? "rightAnim"
            : "leftAnim"
        ].getAnimationDrawer();
    }
    return drawer;
  }
  /**
   * @param {int}dmg
   */
  lowerHp(dmg) {
    this.hp -= dmg;
    if (this.hp < 0) this.hp = 0;
  }
  draw(ctx) {
    console.error("draw is not implemented");
  }
}

export class Enemy extends Creature {
  constructor(
    { xPos, yPos, width, height, id, score, hardness },
    speed,
    hp,
    dmg
  ) {
    const movemementSpeed = speed || 10;

    const enemyAnimationRight = new Animation(assets.get("enemy1Right"), {
      frames: 6,
      currentFrame: 0,
      skippedFrames: 3,
    });
    const enemyAnimationLeft = new Animation(assets.get("enemy1Left"), {
      frames: 6,
      currentFrame: 0,
      skippedFrames: 3,
    });
    const orientedAnimation = new OrientedAnimation(
      enemyAnimationLeft,
      enemyAnimationRight
    );
    const movement = new EnemyMovement(movemementSpeed, xPos, yPos);
    const deathAnimation = new Animation(assets.get("bloodSplatter30"), {
      frames: 30,
      skippedFrames: 0,
      currentFrame: 1,
    });
    const active = true;
    super(
      width,
      height,
      movement,
      orientedAnimation,
      orientedAnimation,
      hp,
      active,
      deathAnimation
    );
    this.id = id || -1;
    this.score = score;
    this.dmg = dmg;
    this.hue = getRandomInt(1, 360);
    this.sat = getRandomInt(1, hardness * 50);
  }
  /**
   * @param {Enemy} enemy
   * @description Takes an enemy as an arguments, checks collison and resolves that collison if needed
   */
  collisionDetect(object) {
    return this !== object && boxCollision(this, object);
  }
  collisionDetectAndResolve(enemy) {
    if (this.collisionDetect(enemy)) {
      resolveCollision(this, enemy);
    }
  }

  /** spawns and enemy at a random postion on the edge of the screen*/
  static spawn(id, player, hardness) {
    const side = Math.floor(Math.random() * 4);
    const enemyHeight = 90;

    const ratioHW = 870 / 899; //hardcodeed it as i cant be bothered at the moment
    const enemyWidth = enemyHeight * ratioHW;
    let xPos, yPos;
    let xRandom = getRandomInt(
      player.movement?.xPos - canvasConfig.width / 2,
      player.movement?.xPos + canvasConfig.width / 2
    );
    let yRandom = getRandomInt(
      player.movement?.yPos - canvasConfig.height / 2,
      player.movement?.yPos + canvasConfig.height / 2
    );
    let rightBound = Math.floor(player.movement?.xPos + canvasConfig.width / 2);
    let leftBound = Math.floor(player.movement?.xPos - canvasConfig.width / 2);
    let topBound = Math.floor(player.movement?.yPos + canvasConfig.height / 2);
    let bottomBound = Math.floor(
      player.movement?.yPos - canvasConfig.height / 2
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
    const speed = getRandomInt(3, 4 + hardness / 2.7);
    const dmg = getRandomInt(5, 20 + hardness);
    const hp = getRandomInt(10, 20 + hardness);
    return new Enemy(
      {
        xPos: xPos,
        yPos: yPos,
        width: enemyWidth,
        height: enemyHeight,
        id: id,
        score: 100,
        hardness: hardness,
      },
      speed,
      hp,
      dmg
    );
  }
  update(px, py, pActive) {
    if (!this.active) return;
    const [dx, dy] = this.movement.follow(px, py);
    if (pActive) this.movement.incrementPosition();
    const drawer = this.getCorrectOrientedDrawer(dx, dy);
    this.drawer = drawer;
  }
  draw(ctx) {
    if (this.drawer === null) {
      return;
    }
    let drawX = this.movement.xPos;
    let drawY = this.movement.yPos;
    //if enemy is dead change the drawer
    if (!this.active) {
      this.drawer = this.deathAnimation.getAnimationDrawer();
      this.drawer(
        ctx,
        drawX - this.width / 2,
        drawY - this.height / 2,
        this.width * 2.5,
        this.height * 2.5
      );
      return;
    }
    ctx.filter = `saturate(${this.sat})`;
    ctx.filter = `hue-rotate(${this.hue}deg)`;
    this.drawer(ctx, drawX, drawY, this.width, this.height);
    ctx.filter = "none";
    //should be in the drawer class
    ctx.fillStyle = "red";
    const healthBar = this.width * (this.hp / this.maxhp);
    ctx.fillRect(drawX, drawY - 10, healthBar, 10);
    ctx.strokeRect(drawX, drawY - 10, this.width, 10);
  }
}

export class Player extends Creature {
  constructor(xPos, yPos, width, height, speed) {
    const movement = new PlayerMovement(speed, xPos, yPos);

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
    const moveAnimation = new OrientedAnimation(
      plMovementAnimationLeft,
      plMovementAnimationRight
    );

    const plIdleAnimationRight = new Animation(assets.get("playerIdleRight"), {
      frames: 6,
      skippedFrames: 10,
      currentFrame: 0,
    });
    const plIdleAnimationLeft = new Animation(assets.get("playerIdleLeft"), {
      frames: 6,
      skippedFrames: 10,
      currentFrame: 0,
    });
    const idleAnimation = new OrientedAnimation(
      plIdleAnimationLeft,
      plIdleAnimationRight
    );
    const deathAnimation = new Animation(assets.get("bloodSplatter30"), {
      frames: 30,
      currentFrame: 0,
      skippedFrames: 0,
    });
    super(
      width,
      height,
      movement,
      moveAnimation,
      idleAnimation,
      100,
      true,
      deathAnimation
    );

    this.weapon = new Rifle(xPos, yPos, this.height); //default weapon;
  }

  update(cursor, bullets, mapDimensions) {
    this.movement.changeDirectionByFollowX(cursor.gameX, this.xPos);
    const shotResult = this.weapon.shoot(
      cursor,
      this.movement.xPos,
      this.movement.yPos,
      this.active
    );
    if (shotResult) {
      bullets?.push(shotResult);
    }
    if (this.hp <= 0) this.active = false;
    const [dx, dy, isOutOfMap] = this.movement.move(
      mapDimensions,
      this.active,
      this.width,
      this.height
    );
    this.drawer = this.active
      ? this.getCorrectOrientedDrawer(dx, dy)
      : this.deathAnimation.getAnimationDrawer();

    if (!isOutOfMap?.at(0)) this.weapon.updatePos(0, dy, mapDimensions);
    else if (!isOutOfMap?.at(1)) this.weapon.updatePos(dx, 0, mapDimensions);
    else this.weapon.updatePos(dx, dy, mapDimensions);
  }
  drawChar(ctx, viewport) {
    //... currentFrame shouldnt have started from zero...
    if (
      !this.active &&
      this.deathAnimation.currentFrame === this.deathAnimation.maxFrame
    ) {
      this.deathAnimation.stopAnim();
      this.dead = true;
    }
    let drawX = this.cx; // Center x-coordinate
    let drawY = this.cy; // Center y-coordinate

    if (viewport.followingX) {
      drawX = viewport.x + viewport.w / 2;
    }
    if (viewport.followingY) {
      drawY = viewport.y + viewport.h / 2;
    }

    const widthFactor = this.active ? 1 : 3 / 2;
    const heightFactor = this.active ? 1 : 3 / 2;

    this.drawer(
      ctx,
      drawX - ((widthFactor - 1) * this.width) / 2,
      drawY - ((heightFactor - 1) * this.height) / 2,
      this.width * widthFactor,
      this.height * heightFactor
    );
  }

  draw(ctx, viewport, cursor) {
    if (this.drawer === null) {
      return;
    }
    if (this.movement.orientation === Orientation.right) {
      this.drawChar(ctx, viewport);
      if (this.active) this.weapon.draw(ctx, cursor);
    } else {
      if (this.active) this.weapon.draw(ctx, cursor);
      this.drawChar(ctx, viewport);
    }
  }
}

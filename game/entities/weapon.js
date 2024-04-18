import { assets } from "../draw/assets.js";
import { Animation } from "../draw/animation.js";
import { Drawer } from "../draw/draw.js";
import { Vector } from "../movement/vector.js";
class Weapon {
  constructor(dmg, attackSpeed, x, y, holderHeight, muzzle) {
    this.dmg = dmg;
    this.weaponActivate = false;
    this.attackSpeed = attackSpeed;
    this.x = x;
    this.y = y + holderHeight / 2.3;
    this.muzzle = muzzle;
  }

  updatePos(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
  setWeaponActivate() {
    this.weaponActivate = true;
  }
  shoot(cursor, x, y, holderActive) {
    if (this.weaponActivate && holderActive) {
      const bullet = new Bullet(this.dmg, 33, x, y, cursor.gameX, cursor.gameY);
      this.weaponActivate = false;
      return bullet;
    }
    return null;
  }
  calculateOrientation(x, y, cursor) {
    const isCursorLeftOfPlayer = cursor.gameX < x;
    return [
      Math.atan2(
        cursor.gameY - y,
        isCursorLeftOfPlayer ? -cursor.gameX + x - 40 : -x + cursor.gameX + 40
      ),
      isCursorLeftOfPlayer,
    ];
  }
}

class Bullet {
  constructor(dmg, speed, originX, originY, targetX, targetY) {
    this.dmg = dmg;

    this.speed = speed;
    this.framesBuffer = 2;
    this.sprite = assets.get("bullet");
    this.targetWidth = this.sprite.image.width / 50;
    this.targetHeight = this.sprite.image.width / 50;
    targetX -= this.targetWidth / 2;
    targetY -= this.targetHeight / 2;
    this.y = originY; //initial
    this.x = originX; //initial
    this.animation = new Animation(assets.get("bulletAnim"), {
      frames: 5,
      currentFrame: 0,
      skippedFrames: 0,
    });
    this.deathAnimation = new Animation(assets.get("bulletDeathAnim"), {
      frames: 5,
      currentFrame: 0,
      skippedFrames: 0,
    });
    this.directionVector = new Vector(originX, originY, targetX, targetY);
    /**
     * @type {Function}
     */
    this.drawer = null;
    this.active = true;
  }

  collidesWithEnemies(totalEnemies) {
    let enemyIndexes = [];
    totalEnemies.forEach((enemy, index) => {
      //ugly but i dont have time to this properly
      if (!enemy.active) return;
      if (
        enemy.collisionDetect({
          movement: {
            xPos: this.x,
            yPos: this.y,
          },
          width: this.targetWidth,
          height: this.targetHeight,
        })
      ) {
        enemyIndexes.push(index);
      }
    });
    return enemyIndexes;
  }
  isOutOfBounds(viewport) {
    const leeway = 100;
    return (
      this.x < viewport.x - leeway ||
      this.x > viewport.x + viewport.w + leeway ||
      this.y < viewport.y - leeway ||
      this.y > viewport.y + viewport.h + leeway
    );
  }
  updatePosition() {
    if (!this.active) return;
    const normalizedVector = this.directionVector.normalized;
    const bulletSpeed = this.speed;
    const dx = normalizedVector.targetX * bulletSpeed;
    const dy = normalizedVector.targetY * bulletSpeed;

    this.x += dx;
    this.y += dy;
  }
  draw(ctx) {
    if (this.framesBuffer !== 0) {
      this.framesBuffer -= 1;
      return;
    }
    this.drawer = this.active
      ? this.animation.getAnimationDrawer()
      : this.deathAnimation.getAnimationDrawer();
    this.drawer(ctx, this.x, this.y, this.targetWidth, this.targetHeight);
  }
}

export class Rifle extends Weapon {
  constructor(x, y, holderHeight) {
    const dmg = 10;
    const attackSpeed = 300;
    super(dmg, attackSpeed, x, y, holderHeight);
    this.muzzle = new Muzzle(this.x, this.y);
    const sprite = assets.get("rifle");
    this.drawer = Drawer.getCroppedImageDrawer(sprite, sprite.image.width, 0);
    this.targetHeight = holderHeight / 3.5;
    this.targetWidth = this.targetHeight / sprite.ratioHW;
  }
  draw(ctx, cursor) {
    //TODO: Angle calc needs refactor
    const [angle, isCursorLeft] = this.calculateOrientation(
      this.x,
      this.y,
      cursor
    );
    ctx.save();
    ctx.translate(this.x, this.y);
    if (isCursorLeft) {
      ctx.scale(-1, 1);
    }
    ctx.rotate(angle);
    this.drawer(ctx, -25, -32, this.targetWidth, this.targetHeight);

    //Muzzle should use the Animation class
    //this would also make it so frames can be skipped easier
    //I just don't have time to make a muzzle animation. (not provided in the sprites)
    if (this.weaponActivate) {
      this.muzzle.frameBuffer = 2;
      this.muzzle.draw(ctx);
    } else if (this.muzzle.frameBuffer !== 0) {
      this.muzzle.draw(ctx);
      this.muzzle.frameBuffer -= 1;
    }
    ctx.restore();
  }
}

class Muzzle {
  constructor() {
    this.weaponTipX = 30; //relative to weapon.
    this.weaponTipY = -36; //relative
    this.skippedFrame = 1;
    this.frameBuffer = 2; //shouldnt be here
    this.sprite = assets.get("muzzle");
    this.targetHeight = 38;
    this.targetWidth = this.targetHeight / this.sprite.ratioHW;
    this.drawer = Drawer.getCroppedImageDrawer(
      this.sprite,
      this.sprite.image.width,
      0,
      true
    );
  }
  draw(ctx) {
    this.drawer(
      ctx,
      this.weaponTipX,
      this.weaponTipY,
      this.targetWidth,
      this.targetHeight
    );
  }
}

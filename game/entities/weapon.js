import { assets } from "../draw/assets.js";
import { Drawer } from "../draw/draw.js";
import { Vector } from "../movement/vector.js";
class Weapon {
  constructor(dmg, attackSpeed, x, y) {
    this.dmg = dmg;
    this.weaponActivate = false;
    this.attackSpeed = attackSpeed;
    this.x = x;
    this.y = y;
  }

  setWeaponActivate() {
    this.weaponActivate = true;
  }
  shoot(cursor, x, y) {
    if (this.weaponActivate) {
      const bullet = new Bullet(this.dmg, 30, x, y, cursor.gameX, cursor.gameY);
      console.log(true);
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
        isCursorLeftOfPlayer ? -cursor.gameX + x - 40 : -x + cursor.gameX - 40
      ),
      isCursorLeftOfPlayer,
    ];
  }
}

class Bullet {
  constructor(damage, speed, originX, originY, targetX, targetY) {
    this.damage = damage;
    this.speed = speed;
    this.directionVector = new Vector(originX, originY, targetX, targetY);
    this.sprite = assets.get("bullet");
    this.drawer = Drawer.getBulletDrawer(this.sprite);
    this.x = originX;
    this.y = originY;
    this.targetWidth = this.sprite.image.width / 50;
    this.targetHeight = this.sprite.image.width / 50;
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
  updatePosition(viewport) {
    const normalizedVector = this.directionVector.normalized;
    const bulletSpeed = this.speed;
    const dx = normalizedVector.targetX * bulletSpeed;
    const dy = normalizedVector.targetY * bulletSpeed;

    this.x += dx;
    this.y += dy;
  }
  draw(ctx) {
    this.drawer(ctx, this.x, this.y, this.targetWidth, this.targetHeight);
  }
}

export class Rifle extends Weapon {
  constructor() {
    const dmg = 10;
    const attackSpeed = 300;
    const spriteName = "rifle";
    const sprite = assets.get(spriteName);
    super(dmg, attackSpeed);
    this.drawer = Drawer.getRifleDrawer(sprite);
  }
  draw(ctx, x, y, holderHeight, cursor) {
    const [angle, isCursorLeft] = this.calculateOrientation(x, y, cursor);
    this.drawer(ctx, x, y, holderHeight, angle, isCursorLeft);
  }
}

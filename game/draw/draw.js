export class Drawer {
  constructor() {
    return (ctx, drawX, drawY, width, height) => {
      ctx.save();
      ctx.fillStyle = "black";
      ctx.fillRect(drawX, drawY, width, height);
      ctx.restore();
    };
  }
  /**
   * @param {Sprite}sprite - sprite to be cropped
   * @param {int}widthOfSingleDivision - sets the width of a divison
   * @param {int} nth - sets which image to get*/
  static getCroppedImageDrawer(sprite, widthOfSingleDivision, nth) {
    return (ctx, posX, posY, width, height) => {
      const startX = widthOfSingleDivision * nth;
      const cropWidth = Math.min(
        widthOfSingleDivision,
        sprite.image.width - startX
      );
      ctx.drawImage(
        sprite.image,
        startX,
        0,
        cropWidth,
        sprite.image.height,
        posX,
        posY,
        width,
        height
      );
    };
  }
  /**
   * @param {Sprite} sprite  sprite to be used as the cursor
   * @returns {Function} function to draw the cursor
   */
  static getCursorDrawer(sprite, width, height) {
    return (ctx, mouseX, mouseY) => {
      const spriteWidth = sprite.image.width;
      const spriteHeight = sprite.image.height;

      const posX = mouseX - spriteWidth / 2;
      const posY = mouseY - spriteHeight / 2;
      Drawer.getCroppedImageDrawer(sprite, spriteWidth, 0)(
        ctx,
        posX,
        posY,
        width,
        height
      );
    };
  }
  /**
   * drawer function for the rifle
   * @param {Sprite} sprite - rifle sprite
   * @returns {Function} drawer function
   */
  //TODO: Needs refactor to use the Vector Class for the angle and calculation
  static getRifleDrawer(sprite) {
    return (ctx, x, y, holderHeight, angle, isCursorLeft) => {
      const spriteWidth = sprite.image.width;
      const spriteHeight = sprite.image.height;
      const targetHeight = holderHeight / 3.5;
      const targetWidth = targetHeight / sprite.ratioHW;

      ctx.save();
      ctx.translate(x, y + holderHeight / 2.3);
      if (isCursorLeft) {
        ctx.scale(-1, 1);
      }
      ctx.rotate(angle);
      ctx.drawImage(
        sprite.image,
        0,
        0,
        spriteWidth,
        spriteHeight,
        -25,
        -32,
        targetWidth,
        targetHeight
      );
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(400, -45);
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.fillStyle = "red";
      ctx.restore();
    };
  }
  static getBulletDrawer(sprite) {
    return this.getCroppedImageDrawer(sprite, sprite.image.width, 0);
  }
}

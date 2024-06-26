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
    /**
     *@param {canvasContext} ctx @param {number} posX @param {number} posY @param {number} width @param {number} height  canvas context for drawing.
     *@param {boolean} debug - indicates whetherdebug mode is enabled (optional).
     */
    return (ctx, posX, posY, width, height, debug) => {
      if (debug) {
        console.log(
          "posX: " + posX,
          "posY: " + posY,
          "width: " + width,
          "height: " + height,
          "widthOfSingleDivision: " + widthOfSingleDivision
        );
      }
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
}

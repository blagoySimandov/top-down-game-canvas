export class Animation {
  /**@param {Sprite} keyframes - Sprite with the keyframes in a horizontal manner.
   * @param {int} frames - number of frames each sprite gets, the default is one.
   * @param {int} currentFrame - The current animation  frame*/
  constructor(keyframes, { frames, currentFrame, skippedFrames }) {
    if (keyframes) {
      this.currentFrame = currentFrame || 0;
      this.keyframes = keyframes;
      this.cropWidth = Math.floor(keyframes.image.width / frames);
      this.maxFrame = frames;
      this.skippedFrames = skippedFrames || 0;
      this.currentSkippedFrames = this.skippedFrames;
    }
  }
  /**Starts the animation.
   */
  getAnimationDrawler() {
    if (this.currentFrame < this.maxFrame) {
      const drawler = Drawler.getCroppedImageDrawer(
        this.keyframes,
        this.cropWidth,
        this.currentFrame
      );
      if (this.currentSkippedFrames === 0) {
        this.currentFrame += 1;
        this.currentSkippedFrames = this.skippedFrames;
      } else {
        this.currentSkippedFrames -= 1;
      }
      return drawler;
    }
    this.currentFrame = 0;
    return Drawler.getCroppedImageDrawer(
      this.keyframes,
      this.cropWidth,
      this.currentFrame
    );
  }
}
export class OrientedAnimation {
  /**@param {Animation} leftOrientation @param {Animation} rightOrientation*/
  constructor(leftOrientation, rightOrientation) {
    this.leftAnim = leftOrientation;
    this.rightAnim = rightOrientation;
  }
}

export class Sprite {
  constructor(image, orientation) {
    this.image = image;
    this.orientation = orientation;
  }
}

export class Drawler {
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
      // Determine if rotation is needed
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
}

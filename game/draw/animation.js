import { Drawer } from "./draw.js";
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
  getAnimationDrawer() {
    if (this.currentFrame < this.maxFrame) {
      const drawer = Drawer.getCroppedImageDrawer(
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
      return drawer;
    }
    this.currentFrame = 0;
    return Drawer.getCroppedImageDrawer(
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
    this.ratioHW = this.image.height / this.image.width;
  }
}

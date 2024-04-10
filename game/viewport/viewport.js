export class Viewport {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.followingX = false;
    this.followingY = false;
  }

  draw(ctx) {
    // Save the current state of the context
    ctx.save();

    // Set the stroke style to whatever you want (color, width, etc.)
    ctx.strokeStyle = "black"; // Transparent color

    // Draw the rectangle outline without filling it
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    // Restore the saved state of the context
    ctx.restore();
  }
}

export class Camera {
  constructor(player) {
    this.viewport = new Viewport(200, 300, 1050, 750);
    this.player = player;
    this.xDeadZone = 0; // Adjust as needed
    this.yDeadZone = 0; // Adjust as needed
  }

  update() {
    let followingX = true;
    let followingY = true;

    let x = this.player.xPos;
    let y = this.player.yPos;

    // Calculate viewport position based on dead zones
    if (x - this.viewport.w / 2 < this.xDeadZone) {
      this.viewport.x = 0;
      followingX = false;
    } else {
      this.viewport.x = x - this.viewport.w / 2;
    }

    if (y - this.viewport.h / 2 < this.yDeadZone) {
      this.viewport.y = 0;
      followingY = false;
    } else {
      this.viewport.y = y - this.viewport.h / 2;
    }

    // Update viewport's following properties
    this.viewport.followingX = followingX;
    this.viewport.followingY = followingY;
  }
}

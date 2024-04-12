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
    ctx.save();

    ctx.strokeStyle = "black"; // Transparent color

    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.restore();
  }
}

export class Camera {
  constructor(player) {
    this.viewport = new Viewport(200, 300, 1050, 750);
    this.player = player;
    this.xDeadZone = this.viewport.w / 2;
    this.yDeadZone = this.viewport.h / 2;
  }

  update(mapWidth, mapHeight) {
    let followingX = true;
    let followingY = true;

    let x = this.player.cx;
    let y = this.player.cy;

    if (x - this.xDeadZone < 0) {
      this.viewport.x = 0;
      followingX = false;
    } else if (x + this.xDeadZone >= mapWidth) {
      this.viewport.x = mapWidth - this.viewport.w;
      followingX = false;
    } else {
      this.viewport.x = x - this.xDeadZone;
    }

    if (y - this.yDeadZone < 0) {
      this.viewport.y = 0;
      followingY = false;
    } else if (y + this.yDeadZone >= mapHeight) {
      this.viewport.y = mapHeight - this.viewport.h;
      followingY = false;
    } else {
      this.viewport.y = y - this.yDeadZone;
    }

    this.viewport.followingX = followingX;
    this.viewport.followingY = followingY;
  }
}

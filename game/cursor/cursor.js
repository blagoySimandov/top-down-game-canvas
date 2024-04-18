import { assets } from "../draw/assets.js";
import { Drawer } from "../draw/draw.js";

export class Cursor {
  constructor(weapon, endgameScreen) {
    this.endgameScreen = endgameScreen;
    this.x = 0;
    this.weapon = weapon;
    this.y = 0;
    this.gameX = 0;
    this.gameY = 0;
    this.radius = 10;
    this.color = "red";
    const sprite = assets.get("crosshair1");
    this.width = sprite.image.width;
    this.height = sprite.image.height;
    this.drawer = Drawer.getCursorDrawer(sprite, this.height, this.width);
  }
  setGamePos(x, y) {
    this.gameX = x;
    this.gameY = y;
  }
  init(cnv) {
    cnv.addEventListener("mousemove", (event) => {
      const rect = cnv.getBoundingClientRect();
      this.x = event.clientX - rect.left;
      this.y = event.clientY - rect.top;
    });
    cnv.addEventListener("click", (event) => {
      if (this.endgameScreen.active)
        this.endgameScreen.handleClick(this.x, this.y);
      this.weapon.setWeaponActivate();
    });
  }

  draw(ctx) {
    this.drawer(ctx, this.gameX, this.gameY);
  }
}

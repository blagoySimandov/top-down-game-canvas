export class Weapon {
  constructor(dmg, attackInterval) {
    this.dmg = dmg;
    this.attackInterval = this.attackInterval;
  }
  draw(ctx, player) {
    ctx.fillStyle = "blue";
    const offset = 30;
    //adding the correct offset depending on the bit
    let xOff =
      (player.orientation >> 0) & 1
        ? offset
        : (player.orientation >> 1) & 1
        ? -offset
        : 0;
    let yOff =
      (player.orientation >> 3) & 1
        ? offset
        : (player.orientation >> 2) & 1
        ? -offset
        : 0;

    let x = player.xPos + xOff;
    let y = player.yPos + yOff;
    ctx.fillRect(x, y, 20, 30);
  }
}

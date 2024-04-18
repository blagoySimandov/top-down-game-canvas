export default class EndGameScreen {
  constructor(score, viewportWidth, viewportHeight) {
    this.score = score.score;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.active = false;
    this.playAgain = false;
  }

  activateEndgameScreen() {
    this.active = true;
  }
  handleClick(mx, my) {
    if (
      mx > this.buttonX &&
      mx < this.buttonX + this.buttonW &&
      my > this.buttonY &&
      my < this.buttonY + this.buttonH
    ) {
      this.playAgain = true;
    }
  }
  drawPlayAgain(ctx, xMain, yMain, textWidth) {
    const playagain = "Play Again";
    const playAgainW = ctx.measureText(playagain).width;
    const buttonX = xMain + textWidth / 4 - playAgainW / 4;
    const buttonY = yMain + 45;
    const buttonW = playAgainW + 30;
    const buttonH = 45;
    this.buttonX = buttonX;
    this.buttonY = buttonY;
    this.buttonW = buttonW;
    this.buttonH = buttonH;
    ctx.font = "30px Times New Roman";
    ctx.strokeRect(buttonX, buttonY, buttonW, buttonH);
    ctx.fillText(playagain, xMain + textWidth / 4, yMain + 80);
  }
  drawGameOver(ctx) {
    ctx.font = "50px Times New Roman";
    ctx.fillStyle = "black";
    const mainText = "GAME OVER";
    const textWidth = ctx.measureText(mainText).width;

    const offsetY = 30;
    const xMain = this.viewportWidth / 2 - textWidth / 2;
    const yMain = this.viewportHeight / 2 - offsetY;
    ctx.fillText(mainText, xMain, yMain);
    return [xMain, yMain, textWidth];
  }
  draw(ctx) {
    if (!this.active) return;
    const [mainX, mainY, textWidth] = this.drawGameOver(ctx);
    this.drawPlayAgain(ctx, mainX, mainY, textWidth);
  }
}

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
  draw(ctx) {
    if (!this.active) return;
    ctx.font = "50px Times New Roman";
    ctx.fillStyle = "black";
    const mainText = "GAME OVER";
    const playagain = "Play Again";
    const textWidth = ctx.measureText(mainText).width;
    const playAgainW = ctx.measureText(playagain).width;

    const offsetY = 30;
    const xMain = this.viewportWidth / 2 - textWidth / 2;
    const yMain = this.viewportHeight / 2 - offsetY;
    ctx.fillText(mainText, xMain, yMain);

    //TODO: Clean up this mess
    //these need to be attributes
    const buttonX = xMain + textWidth / 4 - playAgainW / 4;
    const buttonY = yMain + 45;
    const buttonW = playAgainW + 30;
    const buttonH = 45;
    this.buttonX = buttonX;
    this.buttonY = buttonY;
    this.buttonW = buttonW;
    this.buttonH = buttonH;
    ctx.font = "30px Times New Roman";
    ctx.fontWeight = "700";
    //messy,but i don't have enough time to clean it up
    ctx.strokeRect(buttonX, buttonY, buttonW, buttonH);
    ctx.fillText(playagain, xMain + textWidth / 4, yMain + 80);
  }
}

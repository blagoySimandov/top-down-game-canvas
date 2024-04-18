export default class InfoBoard {
  constructor(viewportWidth, viewportHeight) {
    this.score = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
  }
  addToScore(adder) {
    this.score += adder;
  }
  draw(ctx, playerhp) {
    ctx.font = "24px Times New Roman";
    ctx.fillStyle = "black";
    const scoreText = "Score: " + this.score;
    const textWidth = ctx.measureText(scoreText).width;
    const x = this.viewportWidth - textWidth - 60;
    const y = 30;
    ctx.fillText(scoreText, x, y);
    //plyaerhp
    const playerHpText = "HP: " + playerhp;
    const playerHpTextX = 10;
    const playerHpTextY = 30;
    ctx.fillText(playerHpText, playerHpTextX, playerHpTextY);
  }
}

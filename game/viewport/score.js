export default class Score {
  constructor(viewportWidth, viewportHeight) {
    this.score = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
  }
  addToScore(adder) {
    this.score += adder;
  }
  draw(ctx) {
    ctx.font = "24px Times New Roman";
    ctx.fillStyle = "black";
    const scoreText = "Score: " + this.score;
    const textWidth = ctx.measureText(scoreText).width;
    const x = this.viewportWidth - textWidth - 60;
    const y = 30;
    ctx.fillText(scoreText, x, y);
  }
}

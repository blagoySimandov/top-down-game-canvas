export default class InfoBoard {
  constructor(viewportWidth, viewportHeight, totalEnemies) {
    this.score = 0;
    this.totalEnemies = totalEnemies;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.hardnessText = "Easy"; //default
    this.hardnessfillStyle = "green";
    this.maxHardness = 7;
    this.start = 0;
  }
  addToScore(adder) {
    this.score += adder;
  }
  draw(ctx, playerhp, endgameActive) {
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
    if (!endgameActive) this.drawDifficulty(ctx);
  }
  drawDifficulty(ctx) {
    //harndess
    switch (this.totalEnemies.hardness) {
      case 7:
        this.hardnessText = "Medium";
        this.hardnessfillStyle = "yellow"; // Progress color
        this.start = 7;
        break;
      case 15:
        this.hardnessText = "Hard";
        this.hardnessfillStyle = "red";
        this.start = 15;
        break;
      case 20:
        this.hardnessText = "Extreme";
        this.hardnessfillStyle = "purple";
        this.start = 20;
        break;
    }

    const hardnessText = "Difficulty: " + this.hardnessText;
    const hardnexxTextX = 100;
    const hardnessTextY = 30;
    ctx.fillText(hardnessText, hardnexxTextX, hardnessTextY);
    const maxWidth = 300;
    const pBarH = 30;
    const pBarX = this.viewportWidth / 2 - maxWidth / 2;
    const pBarY = 10;
    let currentWidth =
      (maxWidth * (this.totalEnemies.hardness - this.start)) / this.maxHardness;
    if (currentWidth > maxWidth) currentWidth = maxWidth;
    ctx.fillStyle = "gray";
    //baackground
    ctx.fillRect(pBarX, pBarY, maxWidth, pBarH);
    ctx.fillStyle = this.hardnessfillStyle;
    //progress
    ctx.fillRect(pBarX, pBarY, currentWidth, pBarH);
  }
}

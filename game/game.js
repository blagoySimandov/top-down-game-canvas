import { Player } from "./entities/creature.js";
import { Map } from "./map/map.js";
import { assets } from "./draw/assets.js";
import { TotalBullets, TotalEnemies } from "./entities/total.js";
import { Camera } from "./viewport/camera.js";
import InfoBoard from "./viewport/score.js";
import EndGameScreen from "./viewport/endgame.js";
import { Cursor } from "./cursor/cursor.js";

//globals are created on module load
const player = new Player(525, 375, 70, 100, 10, assets.get("playerMovement"));
export const playerMovement = player.movement;
const weapon = player.weapon;
const map = new Map();
const camera = new Camera(player);
const bullets = new TotalBullets();
const totalEnemies = new TotalEnemies(player);
const infoboard = new InfoBoard(camera.viewport.w, camera.viewport.h, player);
const endGameScreen = new EndGameScreen(
  infoboard,
  camera.viewport.w,
  camera.viewport.h
);
export const cursor = new Cursor(weapon, endGameScreen);
export function game(ctx) {
  camera.update(map.mapWidth, map.mapHeight);
  map.drawMap(ctx, camera.viewport);
  infoboard.draw(ctx, player.hp);

  ctx.save();
  ctx.translate(-camera.viewport.x, -camera.viewport.y);
  drawRelativeToViewport(ctx, camera.viewport);
  ctx.restore();

  if (!player.active) endGameScreen.activateEndgameScreen();
  if (endGameScreen.playAgain) history.go();
  endGameScreen.draw(ctx);
}
function drawRelativeToViewport(ctx, viewport) {
  infoboard.score += bullets.updateBullets(ctx, viewport, totalEnemies);
  player.draw(ctx, viewport, cursor);
  cursor.setGamePos(cursor.x + camera.viewport.x, cursor.y + camera.viewport.y);
  cursor.draw(ctx);
  player.update(cursor, bullets, [map.mapWidth, map.mapHeight]);
  totalEnemies.drawAndUpdateEnemies(ctx, player);
}

import { Player } from "./entities/creature.js";
import { Map } from "./map/map.js";
import { assets } from "./draw/assets.js";
import { TotalBullets, TotalEnemies } from "./entities/total.js";
import { Camera } from "./viewport/camera.js";
import Score from "./viewport/score.js";
import { Cursor } from "./cursor/cursor.js";

//globals are created on module load
const player = new Player(525, 375, 70, 100, 10, assets.get("playerMovement"));
export const playerMovement = player.movement;
const weapon = player.weapon;
const map = new Map();
const camera = new Camera(player);
const bullets = new TotalBullets();
const totalEnemies = new TotalEnemies(player);
const scoreboard = new Score(camera.viewport.w, camera.viewport.h);
export const cursor = new Cursor(weapon);
export function game(ctx) {
  camera.update(map.mapWidth, map.mapHeight);
  map.drawMap(ctx, camera.viewport);
  scoreboard.draw(ctx);
  ctx.save();
  ctx.translate(-camera.viewport.x, -camera.viewport.y);
  drawRelativeToViewport(ctx, camera.viewport);
  ctx.restore();
}
function drawRelativeToViewport(ctx, viewport) {
  scoreboard.score += bullets.updateBullets(ctx, viewport, totalEnemies);
  player.draw(ctx, viewport, cursor);
  cursor.setGamePos(cursor.x + camera.viewport.x, cursor.y + camera.viewport.y);
  cursor.draw(ctx);
  player.update(cursor, bullets);
  totalEnemies.drawAndUpdateEnemies(ctx, player);
}

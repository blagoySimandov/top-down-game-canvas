import { canvasConfig, tileSize, scaledTileSize } from "../config/config.js";
import { assets } from "../draw/assets.js";
import { layer1, layer2 } from "./tilemaps.js";
export class Map {
  constructor() {
    this.visualGrid = [layer1, layer2];
    this.imageAtlas = assets.get("tileset");
    this.tileSize = tileSize;
    this.scaledTileSize = scaledTileSize;
    //Rows,Cols
    this.mapRows = 60;
    this.mapCols = 60;
    this.atlasCols = 6;
    this.logicGrid = [layer1, layer2];
    this.mapHeight = this.mapRows * this.scaledTileSize;
    this.mapWidth = this.mapCols * this.scaledTileSize;
  }
  /**
   * @param {int} c
   * @param {int} r
   */
  getTile(c, r, layerIndex) {
    const index = r * this.mapCols + c;
    return this.visualGrid[layerIndex][index] - 1;
  }
  standsOn(x, y) {
    if (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
      const c = Math.floor(x / this.tileSize);
      const r = Math.floor(y / this.tileSize);
      const tile = this.getTile(c, r);
      return tile !== -1;
    } else {
      return false;
    }
  }
  //https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps/Square_tilemaps_implementation:_Scrolling_maps
  //(hd)
  drawMap(ctx, viewport) {
    let minX = Math.floor(viewport.x / scaledTileSize);
    let minY = Math.floor(viewport.y / scaledTileSize);
    let maxY = Math.ceil((viewport.y + viewport.h) / scaledTileSize);
    let maxX = Math.ceil((viewport.x + viewport.w) / scaledTileSize);
    if (minX < 0) minX = 0;
    if (minY < 0) minY = 0;
    if (maxY > this.mapRows) maxY = this.mapRows;
    if (maxX > this.mapCols) maxX = this.mapCols;
    this.visualGrid.forEach((_, index) => {
      for (let x = minX; x < maxX; x++) {
        for (let y = minY; y < maxY; y++) {
          const tile = this.getTile(x, y, index);
          if (tile === -1) continue;
          let tileX = Math.floor(x * this.scaledTileSize - viewport.x); //- viewport.x
          let tileY = Math.floor(y * this.scaledTileSize - viewport.y); //- viewport.y
          let sourceY = Math.floor(tile / this.atlasCols) * this.tileSize;
          let sourceX = (tile % this.atlasCols) * this.tileSize;
          ctx.drawImage(
            this.imageAtlas.image,
            sourceX,
            sourceY,
            this.tileSize,
            this.tileSize,
            tileX,
            tileY,
            this.scaledTileSize,
            this.scaledTileSize
          );
        }
      }
    });
  }
}

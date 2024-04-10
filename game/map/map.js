import { canvasConfig, tileSize, scaledTileSize } from "../config/config.js";
import { VisualGrid } from "./tilemaps.js";
export class Map {
  constructor() {
    this.visualGrid = VisualGrid;
    this.imageAtlasPath = "/sprites/Tiled_files/Ground_rocks.png";
    const atl = new Image();
    atl.src = this.imageAtlasPath;
    this.imageAtlas = atl;
    this.tileSize = tileSize;
    this.scaledTileSize = scaledTileSize;
    //Rows,Cols
    this.mapRows = 30;
    this.mapCols = 30;
    this.atlasCols = 26;
    this.logicGrid = [];
    this.mapHeight = this.mapRows * this.tileSize;
    this.mapWidth = this.mapCols * this.tileSize;
  }
  /**@param {int} c - column position
   * @param {int} r - row position
   */
  getTile(c, r) {
    const index = r * this.mapCols + c;
    return this.visualGrid[index] - 1;
  }
  standsOn(x, y) {
    if (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
      // Convert coordinates to grid indices
      const c = Math.floor(x / this.tileSize);
      const r = Math.floor(y / this.tileSize);
      // Get the tile at the specified position
      const tile = this.getTile(c, r);
      // Return true if the tile is not empty (standing on a tile)
      return tile !== -1;
    } else {
      // Coordinates are outside the map boundaries
      return false;
    }
  }
  //https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps/Square_tilemaps_implementation:_Scrolling_maps
  drawMap(ctx, viewport) {
    let minX = Math.floor(viewport.x / scaledTileSize);
    let minY = Math.floor(viewport.y / scaledTileSize);
    let maxY = Math.ceil((viewport.y + viewport.h) / scaledTileSize);
    let maxX = Math.ceil((viewport.x + viewport.w) / scaledTileSize);
    if (minX < 0) minX = 0;
    if (minY < 0) minY = 0;
    if (maxY > this.mapRows) maxY = this.mapRows;
    if (maxX > this.mapCols) maxX = this.mapCols;
    for (let x = minX; x < maxX; x++) {
      for (let y = minY; y < maxY; y++) {
        const tile = this.getTile(x, y);
        let tileX = Math.floor(x * this.scaledTileSize - viewport.x);
        let tileY = Math.floor(y * scaledTileSize - viewport.y);
        let sourceY = Math.floor(tile / this.atlasCols) * this.tileSize;
        let sourceX = (tile % this.atlasCols) * this.tileSize;
        ctx.drawImage(
          this.imageAtlas,
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
  }
}

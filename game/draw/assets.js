import { Orientation } from "../config/config.js";
import { Sprite } from "./animation.js";

export const assets = new Map();
export const assetDetails = {
  playerMovementRight: {
    path: "./game/sprites/playerMovementRight.png",
    orientation: Orientation.right,
  },
  enemy1Left: {
    path: "./game/sprites/enemy1Left.png",
    orientation: Orientation.right,
  },
  enemy1Right: {
    path: "./game/sprites/enemy1Right.png",
    orientation: Orientation.right,
  },
  muzzle: {
    path: "./game/sprites/muzzle.png",
    orientation: Orientation.right,
  },
  crosshair1: {
    path: "./game/sprites/crosshair1.png",
    orientation: Orientation.right,
  },
  playerMovementLeft: {
    path: "./game/sprites/playerMovementLeft.png",
    orientation: Orientation.left,
  },
  bulletAnim: {
    path: "./game/sprites/bulletAnim.png",
    orientation: Orientation.left,
  },
  bloodSplatter30: {
    path: "./game/sprites/bloodSplatter30.png",
    orientation: Orientation.left,
  },
  tileset: {
    path: "./game/map/tileset.png",
    orientation: null,
  },
  bulletDeathAnim: {
    path: "./game/sprites/bulletDeathAnim.png",
    orientation: Orientation.left,
  },
  playerIdleLeft: {
    path: "./game/sprites/playerIdleLeft.png",
    orientation: Orientation.left,
  },
  playerIdleRight: {
    path: "./game/sprites/playerIdleRight.png",
    orientation: Orientation.Right,
  },
  bullet: {
    path: "./game/sprites/bullet.png",
    orientation: Orientation.Right,
  },
  rifle: {
    path: "./game/sprites/rifle.png",
    orientation: Orientation.right,
  },
};
export async function loadAssets(assetDetails) {
  const assetPromises = [];
  for (const [name, details] of Object.entries(assetDetails)) {
    const assetPromise = new Promise((resolve, reject) => {
      const asset = new Image();
      asset.onload = () => resolve(asset);
      asset.onerror = reject;
      asset.src = details.path;
    });
    assetPromises.push(assetPromise);
    assetPromise.then((asset) => {
      const sprite = new Sprite(asset, details.orientation);
      assets.set(name, sprite);
    });
  }
  await Promise.all(assetPromises);
  return 0;
}

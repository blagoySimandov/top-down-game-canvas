import { Orientation } from "../config/config.js";
import { Sprite } from "./animation.js";

export const assets = new Map();
export const assetDetails = {
  playerMovementRight: {
    path: "/game/sprites/playerMovementRight.png",
    orientation: Orientation.right,
  },
  playerMovementLeft: {
    path: "/game/sprites/playerMovementLeft.png",
    orientation: Orientation.left,
  },
  playerIdleLeft: {
    path: "/game/sprites/playerIdleLeft.png",
    orientation: Orientation.left,
  },
  playerIdleRight: {
    path: "/game/sprites/playerIdleRight.png",
    orientation: Orientation.Right,
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

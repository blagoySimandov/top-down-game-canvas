import { loadAssets, assetDetails } from "./game/draw/assets.js";
import { canvasConfig, FPS_COUNTER_ENABLED } from "./game/config/config.js";

let canvas;
let context;
let fpsInterval = 1000 / 30;
let now;
let then = Date.now();
let frames = 0;
let fps = 0;

document.addEventListener("DOMContentLoaded", init, false);

async function init() {
  canvas = document.getElementById("root");
  canvas.width = canvasConfig.width;
  canvas.height = canvasConfig.height;
  context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  await loadAssets(assetDetails);

  const { game, playerMovement, cursor } = await import("./game/game.js");
  cursor.init(canvas);
  document.addEventListener("keydown", (event) =>
    playerMovement.toggleMovement(event, true)
  );

  document.addEventListener("keyup", (event) =>
    playerMovement.toggleMovement(event, false)
  );

  draw(game);
}

function draw(game) {
  now = Date.now();
  let elapsed = now - then;

  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    context.clearRect(0, 0, canvasConfig.width, canvasConfig.height);
    game(context);

    // fps counter
    if (FPS_COUNTER_ENABLED) {
      frames++;
      if (now - fps >= 1000) {
        console.log("FPS: ", frames);
        fps = now;
        frames = 0;
      }
    }
  }

  let requestId = requestAnimationFrame(() => draw(game));
}

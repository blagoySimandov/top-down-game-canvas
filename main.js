import { camera } from "./game/game.js";
import { player } from "./game/game.js";
import { canvasConfig } from "./game/config/config.js";
let canvas;
let context;
let fpsInterval = 1000 / 30;
let now;
let then = Date.now();
let requestId;
document.addEventListener("DOMContentLoaded", init, false);

function init() {
  canvas = document.getElementById("root");
  canvas.width = canvasConfig.width;
  canvas.height = canvasConfig.height;
  context = canvas.getContext("2d");
  document.addEventListener("keydown", (event) =>
    player.toggleMovement(event, true)
  );
  document.addEventListener("keyup", (event) =>
    player.toggleMovement(event, false)
  );
  draw();
}

function draw() {
  now = Date.now();
  let elapsed = now - then;

  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    context.clearRect(0, 0, canvas.width, canvas.height);
    camera(context);
    requestId = requestAnimationFrame(draw);
  } else {
    requestId = requestAnimationFrame(draw);
  }
}

export function boxCollision(object1, object2) {
  return (
    object1.movement.xPos + object1.width >= object2.movement.xPos &&
    object1.movement.xPos <= object2.movement.xPos + object2.width &&
    object1.movement.yPos + object1.height >= object2.movement.yPos &&
    object1.movement.yPos <= object2.movement.yPos + object2.height
  );
}

//the below function was created with the help of this video: https://youtu.be/bObV48lBqMc?si=JUJP2X-gNWbIuhIq
export function resolveCollision(a, b) {
  var vectorX, vecotorY;
  vectorX = a.cx - b.cx;
  vecotorY = a.cy - b.cy;
  if (vecotorY * vecotorY > vectorX * vectorX) {
    if (vecotorY > 0) {
      a.movement.yPos = b.movement.yPos + b.height; // bottom of b
    } else {
      a.movement.yPos = b.movement.yPos - b.height;
    }
  } else {
    if (vectorX > 0) {
      a.movement.xPos = b.movement.xPos + b.width; // right side
    } else {
      a.movement.xPos = b.movement.xPos - a.width;
    }
  }
}
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

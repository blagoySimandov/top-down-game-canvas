export function boxCollision(object1, object2) {
  return (
    object1.xPos + object1.width >= object2.xPos &&
    object1.xPos <= object2.xPos + object2.width &&
    object1.yPos + object1.height >= object2.yPos &&
    object1.yPos <= object2.yPos + object2.height
  );
}

//the below function was created with the help of this video: https://youtu.be/bObV48lBqMc?si=JUJP2X-gNWbIuhIq
export function resolveCollision(a, b) {
  var vectorX, vecotorY;
  vectorX = a.cx - b.cx;
  vecotorY = a.cy - b.cy;
  if (vecotorY * vecotorY > vectorX * vectorX) {
    if (vecotorY > 0) {
      a.yPos = b.yPos + b.height; // bottom of b
    } else {
      a.yPos = b.yPos - b.height;
    }
  } else {
    if (vectorX > 0) {
      a.xPos = b.xPos + b.width; // right side
    } else {
      a.xPos = b.xPos - a.width;
    }
  }
}

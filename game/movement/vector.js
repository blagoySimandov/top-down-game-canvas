export class Vector {
  constructor(originX, originY, targetX, targetY) {
    this.originX = originX;
    this.originY = originY;
    this.targetX = targetX;
    this.targetY = targetY;
  }

  get magnitude() {
    const dx = this.targetX - this.originX;
    const dy = this.targetY - this.originY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  get normalized() {
    const magnitude = this.magnitude;
    const dx = (this.targetX - this.originX) / magnitude;
    const dy = (this.targetY - this.originY) / magnitude;
    return new Vector(0, 0, dx, dy);
  }

  dotProduct(vector) {
    return (
      (this.targetX - this.originX) * (vector.targetX - vector.originX) +
      (this.targetY - this.originY) * (vector.targetY - vector.originY)
    );
  }

  angleBetween(vector) {
    const dotProduct = this.dotProduct(vector);
    const magnitudeProduct = this.magnitude * vector.magnitude;
    return Math.acos(dotProduct / magnitudeProduct);
  }
}

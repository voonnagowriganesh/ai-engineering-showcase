/**
 * Mutable 2D vector.
 *
 * Deliberately mutable: the particle system updates thousands of vectors every
 * frame, and allocating replacements would thrash the garbage collector and
 * cause visible stutter. Use `clone()` when a snapshot is needed.
 */
export class Vector2 {
  constructor(
    public x = 0,
    public y = 0,
  ) {}

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  /** Random vector with components in [-magnitude, magnitude]. */
  static random(magnitude = 1): Vector2 {
    return new Vector2((Math.random() * 2 - 1) * magnitude, (Math.random() * 2 - 1) * magnitude);
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  copyFrom(other: Vector2): this {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  add(other: Vector2): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  scale(factor: number): this {
    this.x *= factor;
    this.y *= factor;
    return this;
  }

  /** Squared distance — avoids a sqrt in hot comparison loops. */
  distanceSquaredTo(other: Vector2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return dx * dx + dy * dy;
  }

  distanceTo(other: Vector2): number {
    return Math.sqrt(this.distanceSquaredTo(other));
  }

  get lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  get length(): number {
    return Math.sqrt(this.lengthSquared);
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}

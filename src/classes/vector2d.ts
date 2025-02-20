import { State } from "./state";

export class Vector2D extends State<{ x: number; y: number }> {
  #changeLisners = new Set<ChangeListener<Vector2D>>();

  constructor(x = 0, y = x) {
    super({ x, y });
  }

  equals(other: Vector2D) {
    return this.x === other.x && this.y === other.y;
  }

  get inverse() {
    return Vector2D.xy(-this.x, -this.y);
  }

  static get one() {
    return new Vector2D(1);
  }

  minus(x: number, y: number): Vector2D;
  minus(other: Vector2D): Vector2D;
  minus(arg1: Vector2D | number, arg2?: number) {
    if (typeof arg1 === "number")
      return Vector2D.xy(this.x - arg1, this.y - (arg2 ?? arg1));
    return Vector2D.xy(this.x - arg1.x, this.y - arg1.y);
  }

  plus(x: number, y: number): Vector2D;
  plus(other: Vector2D): Vector2D;
  plus(arg1: Vector2D | number, arg2?: number) {
    if (typeof arg1 === "number")
      return Vector2D.xy(this.x + arg1, this.y + (arg2 ?? arg1));
    return Vector2D.xy(this.x + arg1.x, this.y + arg1.y);
  }

  toString() {
    return `${this.x}, ${this.y}`;
  }

  static xy(x: number, y: number) {
    return new Vector2D(x, y);
  }

  get x() {
    return this.value.x;
  }

  set x(value) {
    if (this.value.x === value) return;

    this.value.x = value;

    this.handleChange();
  }

  get y() {
    return this.value.y;
  }

  set y(value) {
    if (this.value.y === value) return;

    this.value.y = value;

    this.handleChange();
  }

  static get zero() {
    return new Vector2D();
  }
}

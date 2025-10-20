import { State } from "./state";

export class Vector2DBase {
  #x: number;
  #y: number;

  constructor(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    this.#x = value;
  }

  get y() {
    return this.#y;
  }

  set y(value) {
    this.#y = value;
  }
}

export class Vector2D extends State<Vector2DBase> {
  constructor(x = 0, y = x) {
    super(new Vector2DBase(x, y));
  }

  copy() {
    return new Vector2D(this.x, this.y);
  }

  equals(x: number, y: number): boolean;
  equals(other: Vector2D): boolean;
  equals(arg1: Vector2D | number, arg2?: number) {
    if (typeof arg1 === "number") return this.x === arg1 && this.y === arg2;
    return this.x === arg1.x && this.y === arg1.y;
  }

  get inverse() {
    return Vector2D.xy(-this.x, -this.y);
  }

  static one() {
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
    const xString = Number.isInteger(this.x)
      ? this.x.toString()
      : this.x.toFixed(1);
    const yString = Number.isInteger(this.y)
      ? this.y.toString()
      : this.y.toFixed(1);

    return `${xString}, ${yString}`;
  }

  static xy(x: number, y: number) {
    return new Vector2D(x, y);
  }

  get x() {
    return this.value.x;
  }

  set x(value: number) {
    if (this.value.x === value) return;

    this.value.x = value;

    this.handleChange();
  }

  get y() {
    return this.value.y;
  }

  set y(value: number) {
    if (this.value.y === value) return;

    this.value.y = value;

    this.handleChange();
  }

  static zero() {
    return new Vector2D();
  }
}

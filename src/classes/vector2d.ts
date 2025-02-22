import { createState, State } from "./state";

export class Vector2D {
  #changeLisners = new Set<ChangeListener<Vector2D>>();
  #x: State<number>;
  #y: State<number>;

  constructor(x = 0, y = x) {
    this.#x = createState(x);
    this.#y = createState(y);
  }

  addChangeListener(listener: ChangeListener<Vector2D>) {
    this.#x.addChangeListener(() => listener(this));
    this.#y.addChangeListener(() => listener(this));
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
    return this.#x.value;
  }

  set x(value) {
    if (this.#x.value === value) return;

    this.#x.value = value;

    this.#x.handleChange();
  }

  get y() {
    return this.#y.value;
  }

  set y(value) {
    if (this.#y.value === value) return;

    this.#y.value = value;

    this.#y.handleChange();
  }

  static get zero() {
    return new Vector2D();
  }
}

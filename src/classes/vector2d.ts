export class Vector2D {
  #x: number;
  #y: number;

  constructor(x = 0, y = x) {
    this.#x = x;
    this.#y = y;
  }

  static get one() {
    return new Vector2D(1);
  }

  static xy(x: number, y: number) {
    return new Vector2D(x, y);
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

  static get zero() {
    return new Vector2D();
  }
}

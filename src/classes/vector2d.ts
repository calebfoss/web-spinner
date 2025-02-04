export class Vector2D {
  #changeLisners = new Set<ChangeListener<Vector2D>>();
  #x: number;
  #y: number;

  constructor(x = 0, y = x) {
    this.#x = x;
    this.#y = y;
  }

  equals(other: Vector2D) {
    return this.x === other.x && this.y === other.y;
  }

  get inverse() {
    return Vector2D.xy(-this.x, -this.y);
  }

  onChange(listener: ChangeListener<Vector2D>) {
    this.#changeLisners.add(listener);
  }

  cancelOnChange(listener: ChangeListener<Vector2D>) {
    this.#changeLisners.delete(listener);
  }

  #handleChange() {
    for (const listener of this.#changeLisners) {
      listener(this);
    }
  }

  static get one() {
    return new Vector2D(1);
  }

  plus(other: Vector2D) {
    return Vector2D.xy(this.x + other.x, this.y + other.y);
  }

  toString() {
    return `${this.x}, ${this.y}`;
  }

  static xy(x: number, y: number) {
    return new Vector2D(x, y);
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    if (this.#x === value) return;

    this.#x = value;

    this.#handleChange();
  }

  get y() {
    return this.#y;
  }

  set y(value) {
    if (this.#y === value) return;

    this.#y = value;

    this.#handleChange();
  }

  static get zero() {
    return new Vector2D();
  }
}

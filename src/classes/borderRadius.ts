import { State } from "./state";

class BorderRadiusBase {
  #topLeft: number;
  #topRight: number;
  #bottomLeft: number;
  #bottomRight: number;

  constructor(all: number);
  constructor(topLeftAndBottomRight: number, toRightAndBottomLeft: number);
  constructor(
    topLeft: number,
    topRightAndBottomLeft: number,
    bottomRight: number
  );
  constructor(
    topLeft: number,
    topRight: number,
    bottomRight: number,
    bottomLeft: number
  );
  constructor(arg1: number, arg2?: number, arg3?: number, bottomLeft?: number) {
    this.#topLeft = arg1;

    if (arg2 === undefined) {
      this.#topRight = this.#bottomLeft = this.#bottomRight = arg1;
    } else if (arg3 === undefined) {
      this.#bottomRight = arg1;
      this.#topRight = arg2;
      this.#bottomLeft = arg2;
    } else if (bottomLeft === undefined) {
      this.#topRight = arg2;
      this.#bottomLeft = arg2;
      this.#bottomRight = arg3;
    } else {
      this.#topRight = arg2;
      this.#bottomRight = arg3;
      this.#bottomLeft = bottomLeft;
    }
  }

  get topLeft() {
    return this.#topLeft;
  }

  set topLeft(value) {
    this.#topLeft = value;
  }

  get topRight() {
    return this.#topRight;
  }

  set topRight(value) {
    this.#topRight = value;
  }

  get bottomLeft() {
    return this.#bottomLeft;
  }

  set bottomLeft(value) {
    this.#bottomLeft = value;
  }

  get bottomRight() {
    return this.#bottomRight;
  }

  set bottomRight(value) {
    this.#bottomRight = value;
  }
}

export class BorderRadius extends State<BorderRadiusBase> {
  constructor(all: number);
  constructor(topLeftAndBottomRight: number, toRightAndBottomLeft: number);
  constructor(
    topLeft: number,
    topRightAndBottomLeft: number,
    bottomRight: number
  );
  constructor(
    topLeft: number,
    topRight: number,
    bottomRight: number,
    bottomLeft: number
  );
  constructor(arg1: number, arg2?: number, arg3?: number, bottomLeft?: number) {
    const base =
      arg2 === undefined
        ? new BorderRadiusBase(arg1)
        : arg3 === undefined
        ? new BorderRadiusBase(arg1, arg2)
        : bottomLeft === undefined
        ? new BorderRadiusBase(arg1, arg2, arg3)
        : new BorderRadiusBase(arg1, arg2, arg3, bottomLeft);

    super(base);
  }

  get topLeft() {
    return super.value.topLeft;
  }

  set topLeft(value) {
    if (value === this.topLeft) return;

    super.value.topLeft = value;

    this.handleChange();
  }

  get topRight() {
    return super.value.topRight;
  }

  set topRight(value) {
    if (value === this.topRight) return;

    super.value.topRight = value;

    this.handleChange();
  }

  get bottomRight() {
    return super.value.bottomRight;
  }

  set bottomRight(value) {
    if (value === this.bottomRight) return;

    super.value.bottomRight = value;

    this.handleChange();
  }

  get bottomLeft() {
    return super.value.bottomLeft;
  }

  set bottomLeft(value) {
    if (value === this.bottomLeft) return;

    super.value.bottomLeft = value;

    this.handleChange();
  }

  equals(other: BorderRadius) {
    const otherArray = other.toArray();

    return this.toArray().every((value, index) => value === otherArray[index]);
  }

  toArray() {
    return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
  }

  toString() {
    return this.toArray().join(", ");
  }

  get value() {
    return super.value;
  }
}

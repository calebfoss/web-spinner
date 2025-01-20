export type AngleUnit = (typeof Angle)["unit"][keyof (typeof Angle)["unit"]];

export class Angle {
  #degrees: number | null = null;
  #radians: number | null = null;

  constructor(unit: AngleUnit, value: number) {
    switch (unit) {
      case Angle.unit.degrees:
        this.#degrees = value;
        break;
      case Angle.unit.radians:
        this.#radians = value;
        break;
    }
  }

  static degrees(value: number) {
    return new Angle(Angle.unit.degrees, value);
  }

  get degrees() {
    if (this.#degrees !== null) return this.#degrees;

    if (this.#radians === null) throw new Error("Angle missing value");

    this.#degrees = this.#radians * (180 / Math.PI);

    return this.#degrees;
  }

  set degrees(value) {
    this.#degrees = value;

    if (this.#radians === null) return;

    this.#radians = value * (Math.PI / 180);
  }

  static radians(value: number) {
    return new Angle(Angle.unit.radians, value);
  }

  get radians() {
    if (this.#radians !== null) return this.#radians;

    if (this.#degrees === null) throw new Error("Angle missing value");

    this.#radians = this.#degrees * (Math.PI / 180);

    return this.#radians;
  }

  set radians(value) {
    this.#radians = value;

    if (this.#degrees === null) return;

    this.#degrees = value * (180 / Math.PI);
  }

  static unit = {
    degrees: "deg",
    radians: "rad",
    gradians: "grad",
    turn: "turn",
  } as const;
}

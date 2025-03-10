import { State } from "./state";

export type AngleUnit = (typeof Angle)["unit"][keyof (typeof Angle)["unit"]];

const unitsInCircle: {
  [U in AngleUnit]: number;
} = {
  deg: 360,
  rad: Math.PI * 2,
  grad: 400,
  turn: 1,
};

export class Angle extends State<number> {
  #conversions = new Map<Exclude<AngleUnit, "rad">, number>();

  constructor(unit: AngleUnit, value: number) {
    const radians = unit === "rad" ? value : Angle.convert(value, unit, "rad");

    super(radians);

    if (unit !== "rad") this.#conversions.set(unit, value);
  }

  #getConverted(unit: Exclude<AngleUnit, "rad">) {
    const cached = this.#conversions.get(unit);

    if (cached !== undefined) return cached;

    const conversion = Angle.convert(this.value, "rad", unit);

    this.#conversions.set(unit, conversion);

    return conversion;
  }

  #setConverted(unit: Exclude<AngleUnit, "rad">, value: number) {
    this.#conversions.set(unit, value);

    this.value = Angle.convert(value, unit, "rad");
  }

  get degrees() {
    return this.#getConverted("deg");
  }

  set degrees(value) {
    this.#setConverted("deg", value);
  }

  toString() {
    const conversionCount = this.#conversions.size;

    const [unit, value] =
      conversionCount === 0
        ? ["rad" as AngleUnit, this.value]
        : Array.from(this.#conversions)[conversionCount - 1];

    const valueString = Number.isInteger(value)
      ? value.toString()
      : value.toPrecision(2);

    return valueString + unit;
  }

  static convert(value: number, unitFrom: AngleUnit, unitTo: AngleUnit) {
    return value * (unitsInCircle[unitTo] / unitsInCircle[unitFrom]);
  }

  static degrees(value: number) {
    return new Angle(Angle.unit.degrees, value);
  }

  equals(other: Angle) {
    return super.equals(other) || this.radians === other.radians;
  }

  static radians(value: number) {
    return new Angle(Angle.unit.radians, value);
  }

  get radians() {
    return this.value;
  }

  set radians(value: number) {
    if (this.value === value) return;

    this.#conversions.clear();

    this.value = value;
  }

  static unit = {
    degrees: "deg",
    radians: "rad",
    gradians: "grad",
    turn: "turn",
  } as const;

  static get unitsInCircle() {
    return unitsInCircle;
  }

  static get zero() {
    return Angle.radians(0);
  }
}

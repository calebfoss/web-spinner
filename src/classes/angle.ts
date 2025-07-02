import { State } from "./state";

export type AngleUnitLong = keyof (typeof Angle)["unit"];

export type AngleUnitShort =
  (typeof Angle)["unit"][keyof (typeof Angle)["unit"]];

const unitsInCircle: {
  [U in AngleUnitShort]: number;
} = {
  deg: 360,
  rad: Math.PI * 2,
  grad: 400,
  turn: 1,
};

type AngleConverter = {
  [U in keyof (typeof Angle)["unit"]]: number;
};

export class Angle extends State<number> implements AngleConverter {
  #conversions = new Map<Exclude<AngleUnitShort, "rad">, number>();

  constructor(unit: AngleUnitShort, value: number) {
    const radians = unit === "rad" ? value : Angle.convert(value, unit, "rad");

    super(radians);

    if (unit !== "rad") this.#conversions.set(unit, value);
  }

  #getConverted(unit: Exclude<AngleUnitShort, "rad">) {
    const cached = this.#conversions.get(unit);

    if (cached !== undefined) return cached;

    const conversion = Angle.convert(this.value, "rad", unit);

    this.#conversions.set(unit, conversion);

    return conversion;
  }

  #setConverted(unit: Exclude<AngleUnitShort, "rad">, value: number) {
    this.#conversions.set(unit, value);

    this.value = Angle.convert(value, unit, "rad");
  }

  /**
   * Current value in degrees. 360 degrees is a complete rotation.
   */

  get degrees(): number {
    return this.#getConverted("deg");
  }

  set degrees(value) {
    this.#setConverted("deg", value);
  }

  /**
   * @private
   */

  toString() {
    const conversionCount = this.#conversions.size;

    const [unit, value] =
      conversionCount === 0
        ? ["rad" as AngleUnitShort, this.value]
        : Array.from(this.#conversions)[conversionCount - 1];

    const valueString = Number.isInteger(value)
      ? value.toString()
      : value.toPrecision(2);

    return valueString + unit;
  }

  /**
   * Converts a number from one angle unit to another.
   *
   * @param value angle number to convert
   * @param unitFrom angle unit to convert from
   * @param unitTo unit to convert to
   * @returns converted value
   */

  static convert(
    value: number,
    unitFrom: AngleUnitShort,
    unitTo: AngleUnitShort
  ): number {
    return value * (unitsInCircle[unitTo] / unitsInCircle[unitFrom]);
  }

  /**
   * Creates a new Angle from a value in degrees.
   *
   * @param value number of degrees
   * @returns
   */

  static degrees(value: number): Angle {
    return new Angle(Angle.unit.degrees, value);
  }

  /**
   * Checks if another angle represents the same value as this one.
   *
   * @param other Angle to compare
   * @returns True if the angles are equal.
   */

  equals(other: Angle): boolean {
    return super.equals(other) || this.radians === other.radians;
  }

  /**
   * Current value in gradians. 400 gradians is a complete rotation.
   */

  get gradians(): number {
    return this.#getConverted("grad");
  }

  set gradians(value) {
    this.#setConverted("grad", value);
  }

  /**
   * Creates a new Angle from value in radians.
   *
   * @param value number of radians
   * @returns
   */

  static radians(value: number) {
    return new Angle(Angle.unit.radians, value);
  }

  /**
   * Current value in radians. 2π radians is a complete rotation.
   */

  get radians(): number {
    return this.value;
  }

  set radians(value: number) {
    if (this.value === value) return;

    this.#conversions.clear();

    super.value = value;
  }

  /**
   * Current value in turns. 1 turn is a complete rotation.
   */

  get turn(): number {
    return this.#getConverted("turn");
  }

  set turn(value) {
    this.#setConverted("turn", value);
  }

  /**
   * Most recently used angle unit
   */

  get unit(): AngleUnitLong {
    const conversionCount = this.#conversions.size;

    const [shortUnit] =
      conversionCount === 0
        ? ["rad" as AngleUnitShort, this.value]
        : Array.from(this.#conversions)[conversionCount - 1];

    const longUnit = Object.keys(Angle.unit).find(
      (key) => Angle.unit[key as AngleUnitLong] === shortUnit
    );

    if (longUnit === undefined)
      throw new Error(`Could not find angle unit: ${shortUnit}`);

    return longUnit as AngleUnitLong;
  }

  /**
   * Map of angle units. The keys are the full names of units, and their
   * corresponding value is the abbreviation used in CSS and attribute values.
   */

  static unit = {
    degrees: "deg",
    radians: "rad",
    gradians: "grad",
    turn: "turn",
  } as const;

  /**
   * Map of angle unit abbreviations and the corresponding number of units in
   * a complete rotation.
   */

  static get unitsInCircle(): { [unit in AngleUnitShort]: number } {
    return unitsInCircle;
  }

  /**
   * @private
   */

  get value() {
    return super.value;
  }

  set value(value) {
    this.radians = value;
  }

  /**
   * Creates a new Angle with a value of 0.
   *
   * @returns
   */

  static zero(): Angle {
    return Angle.radians(0);
  }
}

import { NONE } from "..";
import { Angle, AngleUnit } from "../classes/angle";
import { Color } from "../classes/color";
import { DrawStyle } from "../classes/gradient";
import { Vector2D } from "../classes/vector2d";

type AttributeTypeMap = {
  number: number;
  Color: Color;
  FillStrokeStyle: DrawStyle;
  Vector2D: Vector2D;
  Angle: Angle;
};

type AttributeTypeParser = {
  [Type in keyof AttributeTypeMap]: (
    stringValue: string
  ) => AttributeTypeMap[Type];
};

const angleMatch = new RegExp(
  `([\\d\\.]+)\\s*(${Object.values(Angle.unit).join("|")})`
);

const includesNumbers = (str: string) => str.match(/\d/) !== null;

export const attributeParser: AttributeTypeParser = {
  number(stringValue) {
    return parseFloat(stringValue);
  },
  Color(stringValue) {
    const args = stringValue.split(",");

    const numbers = args.map(attributeParser.number);

    switch (numbers.length) {
      case 1:
        return isNaN(numbers[0]) ? new Color(args[0]) : new Color(numbers[0]);
      case 2:
        return new Color(numbers[0], numbers[1]);
      case 3:
        return new Color(numbers[0], numbers[1], numbers[2]);
      case 5:
        console.warn(
          `Found ${numbers.length} arguments passed to Color attribute, but the maximum is 4`
        );
      default:
        return new Color(numbers[0], numbers[1], numbers[2], numbers[3]);
    }
  },
  FillStrokeStyle(stringValue) {
    if (stringValue === NONE || stringValue === "gradient") return stringValue;

    return attributeParser.Color(stringValue);
  },
  Vector2D(stringValue) {
    const numbers = stringValue.split(",").map(attributeParser.number);

    if (numbers.some(Number.isNaN)) throw new Error(`NaN: ${stringValue}`);

    switch (numbers.length) {
      case 0:
        return new Vector2D();
      case 1:
        return new Vector2D(numbers[0]);
      case 3:
        console.warn(
          `Found ${numbers.length} arguments passed to Vecto2D attribute, but the maximum is 2`
        );
      default:
        return new Vector2D(numbers[0], numbers[1]);
    }
  },
  Angle(stringValue) {
    const args = stringValue.match(angleMatch);

    if (args === null)
      throw new Error(`Angle arguments could not be parsed: ${stringValue}`);

    const value = attributeParser.number(args[1]);

    const unit = args[2] as AngleUnit;

    return new Angle(unit, value);
  },
};

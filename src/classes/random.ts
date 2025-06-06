import { Color } from "./color";

type PropertyRanges<P extends string> = {
  [Key in P]?: {
    min?: number;
    max?: number;
  };
};

type GrayRanges = PropertyRanges<"value" | "alpha">;

type HSLRanges = PropertyRanges<"hue" | "saturation" | "lightness" | "alpha">;

type RGBRanges = PropertyRanges<"red" | "green" | "blue" | "alpha">;

export class Random {
  static colorGray(range: GrayRanges): Color;
  static colorGray(
    minValue: number,
    maxValue: number,
    minAlpha?: number,
    maxAlpha?: number
  ): Color;
  static colorGray(
    arg1: GrayRanges | number,
    maxValue?: number,
    minAlpha?: number,
    maxAlpha?: number
  ) {
    const range: GrayRanges =
      typeof arg1 === "object"
        ? arg1
        : {
            value: { min: arg1, max: maxValue },
            alpha: { min: minAlpha, max: maxAlpha },
          };

    return Color.gray(
      Random.int(range.value?.min ?? 0, range.value?.max ?? 255),
      range.alpha === undefined ||
        (range.alpha.min === undefined && range.alpha.max === undefined)
        ? undefined
        : Random.float(range.alpha.min ?? 0, range.alpha.max ?? 1)
    );
  }

  static colorHSL(ranges: HSLRanges): Color;
  static colorHSL(
    minHue: number,
    maxHue: number,
    minSaturation: number,
    maxSaturation: number,
    minLightness: number,
    maxLightness: number,
    minAlpha?: number,
    maxAlpha?: number
  ): Color;
  static colorHSL(
    arg1: HSLRanges | number,
    maxHue?: number,
    minSaturation?: number,
    maxSaturation?: number,
    minLightness?: number,
    maxLightness?: number,
    minAlpha?: number,
    maxAlpha?: number
  ) {
    const ranges: HSLRanges =
      typeof arg1 === "object"
        ? arg1
        : {
            hue: {
              min: arg1,
              max: maxHue,
            },
            saturation: { min: minSaturation, max: maxSaturation },
            lightness: { min: minLightness, max: maxLightness },
            alpha: { min: minAlpha, max: maxAlpha },
          };

    return Color.hsl(
      Random.int(ranges.hue?.min ?? 0, ranges.hue?.max ?? 360),
      Random.int(ranges.saturation?.min ?? 0, ranges.saturation?.max ?? 100),
      Random.int(ranges.lightness?.min ?? 0, ranges.lightness?.max ?? 100),
      ranges.alpha === undefined ||
        (ranges.alpha.min === undefined && ranges.alpha.max === undefined)
        ? undefined
        : Random.float(ranges.alpha.min ?? 0, ranges.alpha.max ?? 1)
    );
  }

  static colorRGB(ranges: RGBRanges): Color;
  static colorRGB(
    minRed: number,
    maxRed: number,
    minGreen: number,
    maxGreen: number,
    minBlue: number,
    maxBlue: number,
    minAlpha?: number,
    maxAlpha?: number
  ): Color;
  static colorRGB(
    arg1: RGBRanges | number,
    maxRed?: number,
    minGreen?: number,
    maxGreen?: number,
    minBlue?: number,
    maxBlue?: number,
    minAlpha?: number,
    maxAlpha?: number
  ) {
    const ranges: RGBRanges =
      typeof arg1 === "object"
        ? arg1
        : {
            red: {
              min: arg1,
              max: maxRed,
            },
            green: { min: minGreen, max: maxGreen },
            blue: { min: minBlue, max: maxBlue },
            alpha: { min: minAlpha, max: maxAlpha },
          };

    return Color.rgb(
      Random.int(ranges.red?.min ?? 0, ranges.red?.max ?? 255),
      Random.int(ranges.green?.min ?? 0, ranges.green?.max ?? 255),
      Random.int(ranges.blue?.min ?? 0, ranges.blue?.max ?? 255),
      ranges.alpha === undefined ||
        (ranges.alpha.min === undefined && ranges.alpha.max === undefined)
        ? undefined
        : Random.int(ranges.alpha.min ?? 0, ranges.alpha.max ?? 255)
    );
  }

  static float(max: number): number;
  static float(min: number, max: number): number;
  static float(arg1: number, arg2?: number) {
    const [min, max] = arg2 === undefined ? [0, arg1] : [arg1, arg2];

    return min + Math.random() * (max - min);
  }

  static of<T extends any[]>(array: T) {
    return array[Random.int(array.length)];
  }

  static int(max: number): number;
  static int(min: number, max: number): number;
  static int(...args: [number]) {
    return Math.floor(Random.float(...args));
  }
}

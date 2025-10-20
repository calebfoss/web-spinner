function hex(n: number) {
  return Math.max(Math.min(Math.floor(n), 255), 0)
    .toString(16)
    .padStart(2, "0");
}

export class Color {
  #str: string;

  constructor(gray: number, alpha?: number);
  constructor(red: number, green: number, blue: number, alpha?: number);
  constructor(colorString: string);
  constructor(
    firstArg: number | string,
    secondArg?: number,
    blue?: number,
    alpha?: number
  ) {
    if (typeof firstArg === "string") {
      this.#str = firstArg;
    } else if (arguments.length < 3) {
      const grayNum = firstArg;
      const grayHex = hex(grayNum);

      const alphaNum = secondArg;
      const alphaHex = alphaNum === undefined ? "" : hex(alphaNum);

      this.#str = `#${grayHex}${grayHex}${grayHex}${alphaHex}`;
    } else {
      const red = firstArg;
      const redHex = hex(red);

      const green = secondArg;
      const greenHex = hex(green as number);

      const blueHex = hex(blue as number);

      const alphaHex = alpha === undefined ? "" : hex(alpha);

      this.#str = `#${redHex}${greenHex}${blueHex}${alphaHex}`;
    }
  }

  static gray(value: number, alpha?: number) {
    return new Color(value, alpha);
  }

  static fromString(value: string) {
    return new Color(value);
  }

  equals(other: Color) {
    return this.#str === other.toString();
  }

  toString() {
    return this.#str;
  }

  static rgb(red: number, green: number, blue: number, alpha?: number) {
    return new Color(red, green, blue, alpha);
  }

  static hsl(
    hue: number,
    saturation: number,
    lightness: number,
    alpha?: number
  ) {
    return new Color(
      `hsl(${hue} ${saturation} ${lightness}${
        alpha === undefined ? "" : ` / ${alpha}`
      })`
    );
  }
}

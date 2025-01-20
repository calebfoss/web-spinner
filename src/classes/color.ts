function hex(n: number) {
  return Math.max(Math.min(Math.floor(n), 255), 0)
    .toString(16)
    .padStart(2, "0");
}

export class Color {
  #hex: string;

  constructor(gray: number, alpha?: number);
  constructor(red: number, green: number, blue: number, alpha?: number);
  constructor(
    firstArg: number,
    secondArg?: number,
    blue?: number,
    alpha?: number
  ) {
    if (arguments.length < 3) {
      const grayNum = firstArg;
      const grayHex = hex(grayNum);

      const alphaNum = secondArg;
      const alphaHex = alphaNum === undefined ? "" : hex(alphaNum);

      this.#hex = `#${grayHex}${grayHex}${grayHex}${alphaHex}`;
    } else {
      const red = firstArg;
      const redHex = hex(red);

      const green = secondArg;
      const greenHex = hex(green as number);

      const blueHex = hex(blue as number);

      const alphaHex = alpha === undefined ? "" : hex(alpha);

      this.#hex = `#${redHex}${greenHex}${blueHex}${alphaHex}`;
    }
  }

  static gray(value: number, alpha?: number) {
    return new Color(value, alpha);
  }

  get hex() {
    return this.#hex;
  }

  static rgb(red: number, green: number, blue: number, alpha?: number) {
    return new Color(red, green, blue, alpha);
  }
}

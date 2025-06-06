import { Random } from "web-spinner";

function matchHex(hex: string, min: number, max: number) {
  const hexValue = Number(`0x${hex}`);

  expect(hexValue >= min).toBe(true);

  expect(hexValue < max).toBe(true);
}

const hslRegEx = /hsl\(\s*?(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*(\d+\.?\d*))?\)/;

function matchNumString(numString: string, min: number, max: number) {
  const number = Number(numString);

  expect(number >= min).toBe(true);

  expect(number < max).toBe(true);
}

describe("random", () => {
  test("int", () => {
    const min = 1;
    const max = 10;

    const randomInt = Random.int(min, max);

    expect(typeof randomInt).toBe("number");

    expect(Number.isInteger(randomInt)).toBe(true);

    expect(randomInt >= min).toBe(true);

    expect(randomInt < max).toBe(true);
  });

  test("float", () => {
    const min = 1;
    const max = 10;

    const randomFloat = Random.float(min, max);

    expect(typeof randomFloat).toBe("number");

    expect(Number.isInteger(randomFloat)).toBe(false);

    expect(randomFloat >= min).toBe(true);

    expect(randomFloat < max).toBe(true);
  });

  describe("colorGray", () => {
    const minValue = 50;
    const maxValue = 75;
    const minAlpha = 100;
    const maxAlpha = 150;

    describe("with alpha", () => {
      test("ranges object", () => {
        const randomColor = Random.colorGray({
          value: { min: minValue, max: maxValue },
          alpha: { min: minAlpha, max: maxAlpha },
        });

        const hexString = randomColor.toString().slice(1);

        matchHex(hexString.slice(0, 2), minValue, maxValue);

        matchHex(hexString.slice(-2), minAlpha, maxAlpha);
      });

      test("separate arguments", () => {
        const randomColor = Random.colorGray(
          minValue,
          maxValue,
          minAlpha,
          maxAlpha
        );

        const hexString = randomColor.toString().slice(1);

        matchHex(hexString.slice(0, 2), minValue, maxValue);

        matchHex(hexString.slice(-2), minAlpha, maxAlpha);
      });
    });

    describe("without alpha", () => {
      test("ranges object", () => {
        const randomColor = Random.colorGray({
          value: { min: minValue, max: maxValue },
        });

        const hexString = randomColor.toString().slice(1);

        matchHex(hexString.slice(0, 2), minValue, maxValue);

        expect(hexString.length).toBe(6);
      });

      test("separate arguments", () => {
        const randomColor = Random.colorGray(minValue, maxValue);

        const hexString = randomColor.toString().slice(1);

        matchHex(hexString.slice(0, 2), minValue, maxValue);

        expect(hexString.length).toBe(6);
      });
    });
  });

  describe("colorHSL", () => {
    const minHue = 30;
    const maxHue = 60;
    const minSat = 40;
    const maxSat = 50;
    const minLight = 80;
    const maxLight = 90;
    const minAlpha = 0.25;
    const maxAlpha = 1;

    describe("with alpha", () => {
      test("ranges object", () => {
        const randomColor = Random.colorHSL({
          hue: { min: minHue, max: maxHue },
          saturation: { min: minSat, max: maxSat },
          lightness: { min: minLight, max: maxLight },
          alpha: { min: minAlpha, max: maxAlpha },
        });

        const fnString = randomColor.toString();

        const matches = fnString.match(hslRegEx);

        if (matches === null) throw new Error("Failed to parse HSL string");

        const [_, hueString, satString, lightString, alphaString] = matches;

        matchNumString(hueString, minHue, maxHue);

        matchNumString(satString, minSat, maxSat);

        matchNumString(lightString, minLight, maxLight);

        matchNumString(alphaString, minAlpha, maxAlpha);
      });

      test("separate arguments", () => {
        const randomColor = Random.colorHSL(
          minHue,
          maxHue,
          minSat,
          maxSat,
          minLight,
          maxLight,
          minAlpha,
          maxAlpha
        );

        const fnString = randomColor.toString();

        const matches = fnString.match(hslRegEx);

        if (matches === null) throw new Error("Failed to parse HSL string");

        const [_, hueString, satString, lightString, alphaString] = matches;

        matchNumString(hueString, minHue, maxHue);

        matchNumString(satString, minSat, maxSat);

        matchNumString(lightString, minLight, maxLight);

        matchNumString(alphaString, minAlpha, maxAlpha);
      });
    });

    describe("without alpha", () => {
      test("ranges object", () => {
        const randomColor = Random.colorHSL({
          hue: { min: minHue, max: maxHue },
          saturation: { min: minSat, max: maxSat },
          lightness: { min: minLight, max: maxLight },
        });

        const fnString = randomColor.toString();

        const matches = fnString.match(hslRegEx);

        if (matches === null) throw new Error("Failed to parse HSL string");

        const [_, hueString, satString, lightString, alphaString] = matches;

        matchNumString(hueString, minHue, maxHue);

        matchNumString(satString, minSat, maxSat);

        matchNumString(lightString, minLight, maxLight);

        expect(alphaString).toBeUndefined();
      });

      test("separate arguments", () => {
        const randomColor = Random.colorHSL(
          minHue,
          maxHue,
          minSat,
          maxSat,
          minLight,
          maxLight
        );

        const fnString = randomColor.toString();

        const matches = fnString.match(hslRegEx);

        if (matches === null) throw new Error("Failed to parse HSL string");

        const [_, hueString, satString, lightString, alphaString] = matches;

        matchNumString(hueString, minHue, maxHue);

        matchNumString(satString, minSat, maxSat);

        matchNumString(lightString, minLight, maxLight);

        expect(alphaString).toBeUndefined();
      });
    });
  });

  describe("colorRGB", () => {
    const minRed = 10;
    const maxRed = 245;
    const minGreen = 20;
    const maxGreen = 235;
    const minBlue = 30;
    const maxBlue = 225;
    const minAlpha = 100;
    const maxAlpha = 150;

    describe("with alpha", () => {
      test("ranges object", () => {
        const randomColor = Random.colorRGB({
          red: { min: minRed, max: maxRed },
          green: { min: minGreen, max: maxGreen },
          blue: { min: minBlue, max: maxBlue },
          alpha: { min: minAlpha, max: maxAlpha },
        });

        const hexString = randomColor.toString().slice(1);

        matchHex(hexString.slice(0, 2), minRed, maxRed);

        matchHex(hexString.slice(2, 4), minGreen, maxGreen);

        matchHex(hexString.slice(4, 6), minBlue, maxBlue);

        matchHex(hexString.slice(6), minAlpha, maxAlpha);
      });

      test("separate arguments", () => {
        const randomColor = Random.colorRGB(
          minRed,
          maxRed,
          minGreen,
          maxGreen,
          minBlue,
          maxBlue,
          minAlpha,
          maxAlpha
        );

        const hexString = randomColor.toString().slice(1);

        matchHex(hexString.slice(0, 2), minRed, maxRed);

        matchHex(hexString.slice(2, 4), minGreen, maxGreen);

        matchHex(hexString.slice(4, 6), minBlue, maxBlue);

        matchHex(hexString.slice(6), minAlpha, maxAlpha);
      });
    });

    describe("without alpha", () => {
      test("ranges object", () => {
        const randomColor = Random.colorRGB({
          red: { min: minRed, max: maxRed },
          green: { min: minGreen, max: maxGreen },
          blue: { min: minBlue, max: maxBlue },
        });

        const hexString = randomColor.toString().slice(1);

        matchHex(hexString.slice(0, 2), minRed, maxRed);

        matchHex(hexString.slice(2, 4), minGreen, maxGreen);

        matchHex(hexString.slice(4, 6), minBlue, maxBlue);

        expect(hexString.length).toBe(6);
      });

      test("separate parameters", () => {
        const randomColor = Random.colorRGB(
          minRed,
          maxRed,
          minGreen,
          maxGreen,
          minBlue,
          maxBlue
        );

        const hexString = randomColor.toString().slice(1);

        matchHex(hexString.slice(0, 2), minRed, maxRed);

        matchHex(hexString.slice(2, 4), minGreen, maxGreen);

        matchHex(hexString.slice(4, 6), minBlue, maxBlue);

        expect(hexString.length).toBe(6);
      });
    });
  });

  test("of", () => {
    const array = ["a", "b", "c", "d"];

    const randomElement = Random.of(array);

    expect(array.includes(randomElement)).toBe(true);
  });
});

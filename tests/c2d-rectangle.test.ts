import { expect, jest, test } from "@jest/globals";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { BorderRadius, Color, createRoot } from "web-spinner";
import { testDimensions, testReflection } from "./sharedTests";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

beforeEach(() => {
  jest.resetAllMocks();

  setupJestCanvasMock();
});

describe("c2d-rectangle", () => {
  const root = createRoot();

  const canvas = root.canvas2D();

  const width = 125;

  const height = 175;

  const rectangle = canvas.rectangle({ width, height });

  testDimensions(rectangle, width, height);

  describe("rounded", () => {
    let renderedRadii:
      | number
      | DOMPointInit
      | Iterable<number | DOMPointInit>
      | undefined
      | null = null;

    beforeEach(() => {
      canvas.context.roundRect = jest.fn(
        (...args: Parameters<CanvasRenderingContext2D["roundRect"]>) => {
          const [x, y, width, height, radii] = args;

          renderedRadii = radii;
        }
      );
    });

    afterEach(() => {
      renderedRadii = null;

      rectangle.borderRadius = null;
    });

    test("single value", () => {
      const singleValue = 5;

      rectangle.borderRadius = singleValue;

      rectangle.render(canvas);

      expect(renderedRadii).toEqual(new Array(4).fill(singleValue));
    });

    test("4 values", () => {
      const topLeft = 1;

      const topRight = 2;

      const bottomRight = 3;

      const bottomLeft = 4;

      rectangle.borderRadius = new BorderRadius(
        topLeft,
        topRight,
        bottomRight,
        bottomLeft
      );

      rectangle.render(canvas);

      expect(renderedRadii).toEqual([
        topLeft,
        topRight,
        bottomRight,
        bottomLeft,
      ]);
    });

    test("state change", async () => {
      await new Promise<void>((resolve) => {
        const topLeft = 1;
        const topRight = 2;
        const bottomRight = 3;
        const bottomLeft = 4;

        rectangle.borderRadius = new BorderRadius(
          topLeft,
          topRight,
          bottomRight,
          bottomLeft
        );

        const { borderRadius } = rectangle;

        const topLeftChange = 5;

        borderRadius.topLeft += topLeftChange;

        requestAnimationFrame(() => {
          expect(renderedRadii).toEqual([
            topLeft + topLeftChange,
            topRight,
            bottomRight,
            bottomLeft,
          ]);

          resolve();
        });
      });
    });

    rectangle.borderRadius = 5;

    const changedRadius = new BorderRadius(1);

    testReflection(
      rectangle,
      "borderRadius",
      "border-radius",
      changedRadius,
      "5, 5, 5, 5",
      "7, 7, 7, 7"
    );

    test("reflection - state change", () => {
      const topLeft = 1;
      const topRight = 2;
      const bottomRight = 3;
      const bottomLeft = 4;

      rectangle.borderRadius = new BorderRadius(
        topLeft,
        topRight,
        bottomRight,
        bottomLeft
      );

      const { borderRadius } = rectangle;

      const topLeftChange = 5;

      borderRadius.topLeft += topLeftChange;

      const attributeValue = rectangle.getAttribute("border-radius");

      expect(attributeValue).toBe(borderRadius.toString());
    });
  });
});

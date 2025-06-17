import { expect, jest, test } from "@jest/globals";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { BorderRadius, createRoot, Vector2D } from "web-spinner";
import { mockMatchMedia, testReflection } from "./shared";
import { waitFor } from "@testing-library/dom";
import { testStroke } from "./testStroke";
import { testRectangleBounds } from "./testRectangleBounds";
import { testFill } from "./testFill";

describe("c2d-rectangle", () => {
  mockMatchMedia();

  setupJestCanvasMock();

  const setup = () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    canvas.context.roundRect = (
      ...args: Parameters<CanvasRenderingContext2D["roundRect"]>
    ) => {};

    const rectangle = canvas.rectangle();

    return { canvas, element: rectangle };
  };

  describe("rounded", () => {
    test("dimensions are passed into render function with border radius", async () => {
      const { element, canvas } = setup();

      const roundRect = jest.spyOn(canvas.context, "roundRect");

      const width = 75;

      const height = 65;

      element.width = width;

      element.height = height;

      element.borderRadius = 5;

      await waitFor(() => {
        expect(roundRect).toHaveBeenCalled();

        expect(roundRect.mock.calls[0][2]).toBe(width);

        expect(roundRect.mock.calls[0][3]).toBe(height);
      });
    });

    test("renders with border radius single value", async () => {
      const { element, canvas } = setup();

      const roundRect = jest.spyOn(canvas.context, "roundRect");

      const radius = 5;

      if (element === null) throw new Error("rectangle is null");

      element.borderRadius = radius;

      await waitFor(() => {
        expect(roundRect).toHaveBeenCalled();

        const radii = roundRect.mock.calls[0][4];

        if (!Array.isArray(radii))
          throw new Error("radii argument is not an array");

        expect(radii).toEqual([radius, radius, radius, radius]);
      });
    });

    test("render with border radius object", async () => {
      const { element, canvas } = setup();

      const roundRect = jest.spyOn(canvas.context, "roundRect");

      const topLeft = 1;

      const topRight = 2;

      const bottomRight = 3;

      const bottomLeft = 4;

      const borderRadius = new BorderRadius(
        topLeft,
        topRight,
        bottomRight,
        bottomLeft
      );

      if (element === null) throw new Error("rectangle is null");

      element.borderRadius = borderRadius;

      await waitFor(() => {
        expect(roundRect).toHaveBeenCalled();

        const radii = roundRect.mock.calls[0][4];

        expect(radii).toEqual([topLeft, topRight, bottomRight, bottomLeft]);
      });
    });

    test("responds to border radius state change", async () => {
      const { element, canvas } = setup();

      const roundRect = jest.spyOn(canvas.context, "roundRect");

      const topLeft = 1;

      const topRight = 2;

      const bottomRight = 3;

      const bottomLeft = 4;

      const borderRadius = new BorderRadius(
        topLeft,
        topRight,
        bottomRight,
        bottomLeft
      );

      if (element === null) throw new Error("rectangle is null");

      element.borderRadius = borderRadius;

      await waitFor(() => {
        expect(roundRect).toHaveBeenCalled();
      });

      const change = 5;

      borderRadius.topLeft += change;

      await waitFor(() => {
        expect(roundRect).toHaveBeenCalledTimes(2);

        const radii = roundRect.mock.calls[1][4];

        expect(radii).toEqual([
          topLeft + change,
          topRight,
          bottomRight,
          bottomLeft,
        ]);
      });
    });

    test("reflection", () => {
      const { element } = setup();

      testReflection(
        element,
        "borderRadius",
        "border-radius",
        new BorderRadius(5)
      );
    });
  });

  testRectangleBounds(setup, "rect");

  testStroke(setup, "rect");

  testFill(setup, "rect");
});

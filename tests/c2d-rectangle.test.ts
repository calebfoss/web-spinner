import { expect, jest, test } from "@jest/globals";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { BorderRadius, createRoot, Vector2D } from "web-spinner";
import { mockMatchMedia, testReflection } from "./shared";
import { Canvas2DCanvasElement } from "../dist/types/elements/visual/canvas";
import { Canvas2DRectangle } from "../dist/types/elements/visual/rectangle";
import { HTMLElementController } from "../dist/types/elements/document/domBase";
import { DocumentContainerWrapper } from "../dist/types/elements/document/container";
import { waitFor } from "@testing-library/dom";
import { testStroke } from "./stroke";

mockMatchMedia();

describe("c2d-rectangle", () => {
  let root: HTMLElementController<
    keyof HTMLElementTagNameMap,
    DocumentContainerWrapper
  > | null = null;

  let canvas: Canvas2DCanvasElement | null = null;

  let rectangle: Canvas2DRectangle | null = null;

  let rect: jest.SpiedFunction<CanvasRenderingContext2D["rect"]> | null = null;

  const roundRect = jest.fn(
    (...args: Parameters<CanvasRenderingContext2D["roundRect"]>) => {}
  );

  beforeEach(() => {
    jest.resetAllMocks();

    mockMatchMedia();

    setupJestCanvasMock();

    root = createRoot();

    canvas = root.canvas2D();

    rect = jest.spyOn(canvas.context, "rect");

    canvas.context.roundRect = roundRect;

    rectangle = canvas.rectangle();
  });

  afterEach(() => {
    if (rectangle === null) throw new Error("rectangle is null after test");

    rectangle.remove();

    rectangle = null;

    if (canvas === null) throw new Error("canvas is null after test");

    canvas.remove();

    canvas = null;

    if (root === null) throw new Error("root is null after test");

    root.remove();

    root = null;
  });

  describe("dimensions", () => {
    test("reflection", () => {
      if (rectangle === null) throw new Error("rectangle is null");

      rectangle.width = 75;

      rectangle.height = 65;

      testReflection(rectangle, "width", "width", 115);

      testReflection(rectangle, "height", "height", 125);
    });

    test("passed into render function", async () => {
      const width = 75;

      const height = 65;

      if (rectangle === null) throw new Error("rectangle is null");

      rectangle.width = width;

      rectangle.height = height;

      await waitFor(() => {
        if (rect === null) throw new Error("rect is null");

        expect(rect).toHaveBeenCalled();

        expect(rect.mock.calls[0][2]).toBe(width);

        expect(rect.mock.calls[0][3]).toBe(height);
      });
    });
  });

  test("rectangle bounds", () => {
    if (rectangle === null) throw new Error("rectangle is null");

    rectangle.offset = Vector2D.xy(50, 65);

    rectangle.width = 75;

    rectangle.height = 85;

    expect(rectangle.topLeft).toEqual(rectangle.offset);

    expect(rectangle.topRight).toEqual(
      rectangle.offset.plus(rectangle.width, 0)
    );

    expect(rectangle.bottomRight).toEqual(
      rectangle.offset.plus(rectangle.width, rectangle.height)
    );

    expect(rectangle.bottomLeft).toEqual(
      rectangle.offset.plus(0, rectangle.height)
    );

    expect(rectangle.center).toEqual(
      rectangle.offset.plus(rectangle.width / 2, rectangle.height / 2)
    );

    rectangle.origin = "center";

    expect(rectangle.topLeft).toEqual(
      rectangle.offset.minus(rectangle.width / 2, rectangle.height / 2)
    );

    expect(rectangle.topRight).toEqual(
      rectangle.offset.plus(rectangle.width / 2, -rectangle.height / 2)
    );

    expect(rectangle.bottomRight).toEqual(
      rectangle.offset.plus(rectangle.width / 2, rectangle.height / 2)
    );

    expect(rectangle.bottomLeft).toEqual(
      rectangle.offset.plus(-rectangle.width / 2, rectangle.height / 2)
    );

    expect(rectangle.center).toEqual(rectangle.offset);

    testReflection(rectangle, "origin", "origin", "topLeft");
  });

  describe("rounded", () => {
    test("dimensions are passed into render function with border radius", async () => {
      const width = 75;

      const height = 65;

      if (rectangle === null) throw new Error("rectangle is null");

      rectangle.width = width;

      rectangle.height = height;

      rectangle.borderRadius = 5;

      await waitFor(() => {
        expect(roundRect).toHaveBeenCalled();

        expect(roundRect.mock.calls[0][2]).toBe(width);

        expect(roundRect.mock.calls[0][3]).toBe(height);
      });
    });

    test("renders with border radius single value", async () => {
      const radius = 5;

      if (rectangle === null) throw new Error("rectangle is null");

      rectangle.borderRadius = radius;

      await waitFor(() => {
        expect(roundRect).toHaveBeenCalled();

        const radii = roundRect.mock.calls[0][4];

        if (!Array.isArray(radii))
          throw new Error("radii argument is not an array");

        expect(radii).toEqual([radius, radius, radius, radius]);
      });
    });

    test("render with border radius object", async () => {
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

      if (rectangle === null) throw new Error("rectangle is null");

      rectangle.borderRadius = borderRadius;

      await waitFor(() => {
        expect(roundRect).toHaveBeenCalled();

        const radii = roundRect.mock.calls[0][4];

        expect(radii).toEqual([topLeft, topRight, bottomRight, bottomLeft]);
      });
    });

    test("responds to border radius state change", async () => {
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

      if (rectangle === null) throw new Error("rectangle is null");

      rectangle.borderRadius = borderRadius;

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
      if (rectangle === null) throw new Error("rectangle is null");

      testReflection(
        rectangle,
        "borderRadius",
        "border-radius",
        new BorderRadius(5)
      );
    });
  });
});

testStroke(() => {
  const root = createRoot();

  const canvas = root.canvas2D();

  const rectangle = canvas.rectangle();

  return { canvas, element: rectangle };
}, "rect");

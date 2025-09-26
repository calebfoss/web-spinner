import { jest } from "@jest/globals";
import { waitFor } from "@testing-library/dom";
import { Canvas2DRectangle } from "../dist/types/elements/visual/rectangle";
import { testReflection } from "./shared";
import { ElementTestSetup, VoidCanvasMethodNames } from "./types";
import { Vector2D } from "web-spinner";

export function testRectangleBounds(
  setup: ElementTestSetup<{
    topLeft: Vector2D;
    topRight: Vector2D;
    bottomRight: Vector2D;
    bottomLeft: Vector2D;
    offset: Vector2D;
    width: number;
    height: number;
    center: Vector2D;
    origin: Canvas2DRectangle["origin"];
  }>,
  renderFunctionName: VoidCanvasMethodNames,
  dimensionRenderScale = 1,
  widthParameterIndex = 2,
  heightParameterIndex = 3
) {
  describe("dimensions", () => {
    test("reflection", () => {
      const { element, teardown } = setup();

      element.width = 75;

      element.height = 65;

      testReflection(element, "width", "width", 115);

      testReflection(element, "height", "height", 125);

      teardown();
    });

    test("passed into render function", async () => {
      const { element, canvas, teardown } = setup();

      const render = jest.spyOn(canvas.context, renderFunctionName);

      const width = 75;

      const height = 65;

      if (element === null) throw new Error("rectangle is null");

      element.width = width;

      element.height = height;

      await waitFor(() => {
        if (render === null) throw new Error("rect is null");

        expect(render).toHaveBeenCalled();

        expect(render.mock.calls[0][widthParameterIndex]).toBe(
          width * dimensionRenderScale
        );

        expect(render.mock.calls[0][heightParameterIndex]).toBe(
          height * dimensionRenderScale
        );
      });

      teardown();
    });
  });

  describe("rectangle bounds", () => {
    const { element, teardown } = setup();

    element.offset = Vector2D.xy(50, 65);

    element.width = 75;

    element.height = 85;

    test("with origin at top left", () => {
      element.origin = "topLeft";

      expect(element.topLeft).toEqual(element.offset);

      expect(element.topRight).toEqual(element.offset.plus(element.width, 0));

      expect(element.bottomRight).toEqual(
        element.offset.plus(element.width, element.height)
      );

      expect(element.bottomLeft).toEqual(
        element.offset.plus(0, element.height)
      );

      expect(element.center).toEqual(
        element.offset.plus(element.width / 2, element.height / 2)
      );
    });

    test("with origin at center", () => {
      element.origin = "center";

      expect(element.topLeft).toEqual(
        element.offset.minus(element.width / 2, element.height / 2)
      );

      expect(element.topRight).toEqual(
        element.offset.plus(element.width / 2, -element.height / 2)
      );

      expect(element.bottomRight).toEqual(
        element.offset.plus(element.width / 2, element.height / 2)
      );

      expect(element.bottomLeft).toEqual(
        element.offset.plus(-element.width / 2, element.height / 2)
      );

      expect(element.center).toEqual(element.offset);
    });

    test("reflection", () => {
      testReflection(element, "origin", "origin", "topLeft");
    });

    teardown();
  });
}

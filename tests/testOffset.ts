import { jest } from "@jest/globals";
import { ElementTestSetup, VoidCanvasMethodNames } from "./types";
import { Vector2D } from "web-spinner";
import { waitFor } from "@testing-library/dom";
import { testReflection } from "./shared";

export function testOffset(
  setup: ElementTestSetup<{
    offset: Vector2D;
    moveOffset: (x: number, y: number) => void;
  }>,
  renderFunctionName: VoidCanvasMethodNames,
  coordinateParameterIndices = { x: 0, y: 1 }
) {
  describe("offset", () => {
    test("coordinates passed into render function", async () => {
      const { element, canvas } = setup();

      const offset = Vector2D.xy(7, 6);

      element.offset = offset;

      const render = jest.spyOn(canvas.context, renderFunctionName);

      await waitFor(() => {
        expect(render).toHaveBeenCalled();

        expect(render.mock.calls[0][coordinateParameterIndices.x]).toBe(
          offset.x
        );

        expect(render.mock.calls[0][coordinateParameterIndices.y]).toBe(
          offset.y
        );
      });
    });

    test("reflection", () => {
      const { element } = setup();

      const offset = Vector2D.xy(7, 6);

      element.offset = offset;

      testReflection(element, "offset", "offset", Vector2D.xy(5, 4));
    });

    test("move offset", async () => {
      const { element, canvas } = setup();

      const render = jest.spyOn(canvas.context, renderFunctionName);

      const offset = Vector2D.xy(7, 6);

      element.offset = offset.copy();

      await waitFor(() => {
        expect(render).toHaveBeenCalled();
      });

      const movement = Vector2D.xy(4, 5);

      element.moveOffset(movement.x, movement.y);

      await waitFor(() => {
        expect(render).toHaveBeenCalledTimes(2);

        expect(render.mock.calls[1][coordinateParameterIndices.x]).toBe(
          offset.x + movement.x
        );

        expect(render.mock.calls[1][coordinateParameterIndices.y]).toBe(
          offset.y + movement.y
        );
      });
    });
  });
}

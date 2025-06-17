import { jest } from "@jest/globals";
import { Angle, Vector2D } from "web-spinner";
import { ElementTestSetup, VoidCanvasMethodNames } from "./types";
import { waitFor } from "@testing-library/dom";

export function testTransform(
  setup: ElementTestSetup<{ anchor: Vector2D; angle: Angle; scale: Vector2D }>,
  renderFunctionName: VoidCanvasMethodNames
) {
  describe("transform", () => {
    test("anchor", async () => {
      const { element, canvas } = setup();

      const translate = jest.spyOn(canvas.context, "translate");

      const anchor = Vector2D.xy(45, 65);

      element.anchor = anchor;

      await waitFor(() => {
        expect(translate).toHaveBeenCalled();

        expect(translate.mock.calls[0]).toEqual([anchor.x, anchor.y]);
      });
    });
  });
}

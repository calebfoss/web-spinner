import { expect, jest, test } from "@jest/globals";
import { waitFor } from "@testing-library/dom";
import { ElementTestSetup, VoidCanvasMethodNames } from "./types";
import { testReflection } from "./shared";

export function testStroke(
  setup: ElementTestSetup<{ lineWidth: number | null }>,
  renderFunctionName: VoidCanvasMethodNames
) {
  describe("stroke", () => {
    test("lineWidth", async () => {
      const { canvas, element } = setup();

      let renderedLineWidth = -1;

      const targetLineWidth = 5;

      const render = jest.fn(() => {
        renderedLineWidth = canvas.context.lineWidth;
      });

      canvas.context[renderFunctionName] = render;

      element.lineWidth = targetLineWidth;

      await waitFor(() => {
        expect(render).toHaveBeenCalled();

        expect(renderedLineWidth).toBe(targetLineWidth);
      });

      testReflection(element, "lineWidth", "line-width", 7);
    });
  });
}

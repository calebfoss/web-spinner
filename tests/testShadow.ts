import { jest } from "@jest/globals";
import { ElementTestSetup, VoidCanvasMethodNames } from "./types";
import { Shadow } from "web-spinner";
import { waitFor } from "@testing-library/dom";

export function testShadow(
  setup: ElementTestSetup<{ shadow: Shadow | null }>,
  renderFunctionName: VoidCanvasMethodNames
) {
  describe("shadow", () => {
    test("renders", async () => {
      const { element, canvas, teardown } = setup();

      const { context } = canvas;

      const shadow = new Shadow({});

      const render = jest
        .spyOn(context, renderFunctionName)
        .mockImplementation(() => {
          expect(context.shadowBlur).toBe(shadow.blur);

          expect(context.shadowColor).toBe(shadow.color.toString());

          expect(context.shadowOffsetX).toBe(shadow.offset.x);

          expect(context.shadowOffsetY).toBe(shadow.offset.y);
        });

      element.shadow = shadow;

      await waitFor(() => {
        expect(render).toHaveBeenCalled();
      });

      teardown();
    });
  });
}

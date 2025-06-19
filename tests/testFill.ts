import { waitFor } from "@testing-library/dom";
import { DrawStyle } from "../dist/types/classes/gradient";
import { ElementTestSetup, VoidCanvasMethodNames } from "./types";
import {
  Color,
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "web-spinner";
import { jest } from "@jest/globals";
import { testReflection } from "./shared";

export function testFill(
  setup: ElementTestSetup<{
    fill: DrawStyle | null;
    renderConicalGradient: (
      context: CanvasRenderingContext2D,
      gradient: ConicalGradient
    ) => CanvasGradient;
    renderLinearGradient: (
      context: CanvasRenderingContext2D,
      gradient: LinearGradient
    ) => CanvasGradient;
    renderRadialGradient: (
      context: CanvasRenderingContext2D,
      gradient: RadialGradient
    ) => CanvasGradient;
  }>,
  renderFunctionName: VoidCanvasMethodNames,
  rendersWithNoFill = true
) {
  describe("fill", () => {
    test("fill", async () => {
      const { canvas, element } = setup();

      let renderedFill: string | CanvasGradient | CanvasPattern;

      const render = jest.fn(() => {
        renderedFill = canvas.context.fillStyle;
      });

      canvas.context[renderFunctionName] = render;

      const color = Color.rgb(75, 150, 225);

      element.fill = color;

      const fill = jest.spyOn(canvas.context, "fill");

      await waitFor(() => {
        expect(render).toHaveBeenCalled();

        expect(fill).toHaveBeenCalled();

        expect(renderedFill).toBe(color.toString());
      });

      const linearGradient = new LinearGradient();

      element.fill = linearGradient;

      await waitFor(() => {
        expect(render).toHaveBeenCalledTimes(2);

        expect(fill).toHaveBeenCalledTimes(2);

        expect(renderedFill instanceof CanvasGradient).toBe(true);
      });

      const radialGradient = new RadialGradient();

      element.fill = radialGradient;

      await waitFor(() => {
        expect(render).toHaveBeenCalledTimes(3);

        expect(fill).toHaveBeenCalledTimes(3);

        expect(renderedFill instanceof CanvasGradient).toBe(true);
      });

      const conicalGradient = new ConicalGradient();

      canvas.context.createConicGradient = jest.fn(
        (
          ...args: Parameters<CanvasRenderingContext2D["createConicGradient"]>
        ) => new CanvasGradient()
      );

      element.fill = conicalGradient;

      await waitFor(() => {
        expect(render).toHaveBeenCalledTimes(4);

        expect(fill).toHaveBeenCalledTimes(4);

        expect(renderedFill instanceof CanvasGradient).toBe(true);
      });

      if (rendersWithNoFill) {
        element.fill = "none";

        await waitFor(() => {
          expect(render).toHaveBeenCalledTimes(5);

          expect(fill).toHaveBeenCalledTimes(4);
        });

        testReflection(element, "fill", "fill", Color.rgb(225, 150, 75));
      }
    });
  });
}

import { expect, jest, test } from "@jest/globals";
import { waitFor } from "@testing-library/dom";
import { ElementTestSetup, VoidCanvasMethodNames } from "./types";
import { testReflection } from "./shared";
import { DrawStyle } from "../dist/types/classes/gradient";
import {
  Color,
  LinearGradient,
  RadialGradient,
  ConicalGradient,
} from "web-spinner";

export function testStroke(
  setup: ElementTestSetup<{
    lineWidth: number | null;
    stroke: DrawStyle | null;
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
  rendersWithNoStroke = true
) {
  describe("stroke", () => {
    test("lineWidth", async () => {
      const { canvas, element, teardown } = setup();

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

      teardown();
    });
  });

  test("stroke", async () => {
    const { canvas, element, teardown } = setup();

    let renderedStroke: string | CanvasGradient | CanvasPattern;

    const render = jest.fn(() => {
      renderedStroke = canvas.context.strokeStyle;
    });

    canvas.context[renderFunctionName] = render;

    const stroke = jest.spyOn(canvas.context, "stroke");

    const color = Color.rgb(75, 150, 225);

    element.stroke = color;

    await waitFor(() => {
      expect(render).toHaveBeenCalled();

      expect(stroke).toHaveBeenCalled();

      expect(renderedStroke).toBe(color.toString());
    });

    testReflection(element, "stroke", "stroke", Color.rgb(225, 150, 75));

    const linearGradient = new LinearGradient();

    element.stroke = linearGradient;

    await waitFor(() => {
      expect(render).toHaveBeenCalledTimes(2);

      expect(stroke).toHaveBeenCalledTimes(2);

      expect(renderedStroke instanceof CanvasGradient).toBe(true);
    });

    const radialGradient = new RadialGradient();

    element.stroke = radialGradient;

    await waitFor(() => {
      expect(render).toHaveBeenCalledTimes(3);

      expect(stroke).toHaveBeenCalledTimes(3);

      expect(renderedStroke instanceof CanvasGradient).toBe(true);
    });

    const conicalGradient = new ConicalGradient();

    canvas.context.createConicGradient = jest.fn(
      (...args: Parameters<CanvasRenderingContext2D["createConicGradient"]>) =>
        new CanvasGradient()
    );

    element.stroke = conicalGradient;

    await waitFor(() => {
      expect(render).toHaveBeenCalledTimes(4);

      expect(stroke).toHaveBeenCalledTimes(4);

      expect(renderedStroke instanceof CanvasGradient).toBe(true);
    });

    if (rendersWithNoStroke) {
      element.stroke = "none";

      await waitFor(() => {
        expect(render).toHaveBeenCalledTimes(5);

        expect(stroke).toHaveBeenCalledTimes(4);
      });
    }

    teardown();
  });
}

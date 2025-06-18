import { expect, jest, test } from "@jest/globals";
import { createRoot, Vector2D } from "web-spinner";
import { mockMatchMedia, testReflection } from "./shared";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { waitFor } from "@testing-library/dom";
import { testTransform } from "./testTransform";
import { testStroke } from "./testStroke";
import { testFill } from "./testFill";

describe("c2d-bezier", () => {
  mockMatchMedia();

  setupJestCanvasMock();

  const setup = () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    const bezier = canvas.bezier();

    return { canvas, element: bezier };
  };

  describe("from and to", () => {
    test("from coordinates passed into moveTo", async () => {
      const { element, canvas } = setup();

      const from = Vector2D.xy(1, 2);

      const moveTo = jest.spyOn(canvas.context, "moveTo");

      element.from = from;

      await waitFor(() => {
        expect(moveTo).toHaveBeenCalled();

        expect(moveTo.mock.calls[0]).toEqual([from.x, from.y]);
      });
    });

    test("from reflection", () => {
      const { element } = setup();

      element.from = Vector2D.xy(1, 2);

      testReflection(element, "from", "from", Vector2D.xy(4, 3));
    });

    test("to coordinates passed into bezierCurveTo", async () => {
      const { element, canvas } = setup();

      const to = Vector2D.xy(1, 2);

      const bezierCurveTo = jest.spyOn(canvas.context, "bezierCurveTo");

      element.to = to;

      await waitFor(() => {
        expect(bezierCurveTo).toHaveBeenCalled();

        expect(bezierCurveTo.mock.calls[0].slice(4)).toEqual([to.x, to.y]);
      });
    });

    test("to reflection", () => {
      const { element } = setup();

      element.to = Vector2D.xy(1, 2);

      testReflection(element, "to", "to", Vector2D.xy(4, 3));
    });
  });

  describe("control points", () => {
    test("controlA coordinates passed into bezierCurveTo", async () => {
      const { element, canvas } = setup();

      const controlA = Vector2D.xy(3, 4);

      element.controlA = controlA;

      const bezierCurveTo = jest.spyOn(canvas.context, "bezierCurveTo");

      await waitFor(() => {
        expect(bezierCurveTo).toHaveBeenCalled();

        expect(bezierCurveTo.mock.calls[0].slice(0, 2)).toEqual([
          controlA.x,
          controlA.y,
        ]);
      });
    });

    test("controlA reflection", () => {
      const { element } = setup();

      element.controlA = Vector2D.xy(3, 4);

      testReflection(element, "controlA", "control-a", Vector2D.xy(6, 5));
    });

    test("controlB coordinates passed into bezierCurveTo", async () => {
      const { element, canvas } = setup();

      const controlB = Vector2D.xy(3, 4);

      element.controlB = controlB;

      const bezierCurveTo = jest.spyOn(canvas.context, "bezierCurveTo");

      await waitFor(() => {
        expect(bezierCurveTo).toHaveBeenCalled();

        expect(bezierCurveTo.mock.calls[0].slice(2, 4)).toEqual([
          controlB.x,
          controlB.y,
        ]);
      });
    });

    test("controlB reflection", () => {
      const { element } = setup();

      element.controlB = Vector2D.xy(3, 4);

      testReflection(element, "controlB", "control-b", Vector2D.xy(6, 5));
    });
  });

  testTransform(setup);

  testStroke(setup, "bezierCurveTo");

  testFill(setup, "bezierCurveTo");
});

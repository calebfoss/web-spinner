import { expect, jest, test } from "@jest/globals";
import { mockMatchMedia, testReflection } from "./shared";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { Angle, createRoot } from "web-spinner";
import { testTransform } from "./testTransform";
import { testRectangleBounds } from "./testRectangleBounds";
import { testStroke } from "./testStroke";
import { testFill } from "./testFill";
import { waitFor } from "@testing-library/dom";
import { testOffset } from "./testOffset";
import { ElementTestSetup } from "./types";
import { testShadow } from "./testShadow";

function testStartEndAngles(
  setup: ElementTestSetup<{ startAngle: Angle; endAngle: Angle }>
) {
  describe("start and end angle", () => {
    test("values are passed to render function", async () => {
      const { element, canvas } = setup();

      const render = jest.spyOn(canvas.context, "ellipse");

      const startAngle = Angle.degrees(30);

      element.startAngle = startAngle;

      const endAngle = Angle.degrees(60);

      element.endAngle = endAngle;

      await waitFor(() => {
        expect(render).toHaveBeenCalled();

        expect(render.mock.calls[0][5]).toBe(startAngle.radians);

        expect(render.mock.calls[0][6]).toBe(endAngle.radians);
      });
    });

    test("reflection", () => {
      const { element } = setup();

      element.startAngle = Angle.degrees(30);

      element.endAngle = Angle.degrees(60);

      testReflection(element, "startAngle", "start-angle", Angle.degrees(60));

      testReflection(element, "endAngle", "end-angle", Angle.degrees(30));
    });
  });
}

describe("c2d-ellipse", () => {
  mockMatchMedia();

  setupJestCanvasMock();

  const setup = () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    const ellipse = canvas.ellipse();

    return { canvas, element: ellipse };
  };

  testStartEndAngles(setup);

  testOffset(setup, "ellipse");

  testTransform(setup);

  testRectangleBounds(setup, "ellipse", 0.5);

  testStroke(setup, "ellipse");

  testFill(setup, "ellipse");

  testShadow(setup, "ellipse");
});

describe("c2d-shape-ellipse", () => {
  const setup = () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    const shape = canvas.shape();

    const ellipse = shape.ellipse();

    return { canvas, element: ellipse };
  };

  testStartEndAngles(setup);

  testTransform(setup, 1);

  testRectangleBounds(setup, "ellipse", 0.5);
});

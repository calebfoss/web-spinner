import { expect, jest, test } from "@jest/globals";
import { mockMatchMedia, testReflection } from "./shared";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { createRoot, Vector2D } from "web-spinner";
import { testTransform } from "./testTransform";
import { testStroke } from "./testStroke";
import { waitFor } from "@testing-library/dom";
import { ElementTestSetup } from "./types";
import { testShadow } from "./testShadow";
import {
  Canvas2DLine,
  Canvas2DShapeLine,
} from "../dist/types/elements/visual/line";

function testTo(setup: ElementTestSetup<{ to: Vector2D }>) {
  describe("to", () => {
    test("to coordinates passed into lineTo", async () => {
      const { element, canvas } = setup();

      const to = Vector2D.xy(1, 2);

      const lineTo = jest.spyOn(canvas.context, "lineTo");

      element.to = to;

      await waitFor(() => {
        expect(lineTo).toHaveBeenCalled();

        expect(lineTo.mock.calls[0]).toEqual([to.x, to.y]);
      });
    });

    test("to reflection", () => {
      const { element } = setup();

      element.to = Vector2D.xy(1, 2);

      testReflection(element, "to", "to", Vector2D.xy(4, 3));
    });
  });
}

describe("c2d-line", () => {
  mockMatchMedia();

  setupJestCanvasMock();

  const setup: ElementTestSetup<Canvas2DLine> = () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    const line = canvas.line();

    return { canvas, element: line, teardown: root.remove.bind(root) };
  };

  afterEach(() => {
    while (document.body.firstChild !== null) document.body.firstChild.remove();
  });

  describe("from", () => {
    test("coordinates passed into moveTo", async () => {
      const { element, canvas } = setup();

      const from = Vector2D.xy(1, 2);

      const moveTo = jest.spyOn(canvas.context, "moveTo");

      element.from = from;

      await waitFor(() => {
        expect(moveTo).toHaveBeenCalled();

        expect(moveTo.mock.calls[0]).toEqual([from.x, from.y]);
      });
    });

    test("reflection", () => {
      const { element } = setup();

      element.from = Vector2D.xy(1, 2);

      testReflection(element, "from", "from", Vector2D.xy(4, 3));
    });
  });

  testTo(setup);

  test("center coordinates match", () => {
    const { element } = setup();

    const from = Vector2D.xy(1, 2);

    const to = Vector2D.xy(4, 3);

    element.from = from;

    element.to = to;

    expect(element.center.x).toBe(from.x + (to.x - from.x) / 2);

    expect(element.center.y).toBe(from.y + (to.y - from.y) / 2);
  });

  testTransform(setup);

  testStroke(setup, "lineTo");

  testShadow(setup, "lineTo");
});

describe("c2d-shape-line", () => {
  const setup: ElementTestSetup<Canvas2DShapeLine> = () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    const shape = canvas.shape();

    const line = shape.line();

    return { canvas, element: line, teardown: root.remove.bind(root) };
  };

  testTo(setup);

  testTransform(setup, 1);
});

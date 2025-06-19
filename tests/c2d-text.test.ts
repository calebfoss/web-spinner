import { expect, jest, test } from "@jest/globals";
import { createRoot } from "web-spinner";
import { testStroke } from "./testStroke";
import { testFill } from "./testFill";
import { mockMatchMedia, testReflection } from "./shared";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { waitFor } from "@testing-library/dom";

describe("c2d-text", () => {
  setupJestCanvasMock();

  mockMatchMedia();

  const setup = () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    const text = canvas.text();

    return { canvas, element: text };
  };

  describe("align", () => {
    test("sets context textAlign", async () => {
      const { element, canvas } = setup();

      let textAlign: CanvasTextAlign;

      const fillText = jest
        .spyOn(canvas.context, "fillText")
        .mockImplementation(() => {
          textAlign = canvas.context.textAlign;
        });

      const alignments: CanvasTextAlign[] = [
        "center",
        "end",
        "left",
        "right",
        "start",
      ];

      for (const [index, alignment] of alignments.entries()) {
        element.align = alignment;

        await waitFor(() => {
          expect(fillText).toHaveBeenCalledTimes(index + 1);

          expect(textAlign).toBe(alignment);
        });
      }
    });

    test("reflection", () => {
      const { element } = setup();

      element.align = "left";

      testReflection(element, "align", "align", "center");
    });
  });

  describe("baseline", () => {
    test("sets context textBaseline", async () => {
      const { element, canvas } = setup();

      let textBaseline: CanvasTextBaseline;

      const fillText = jest
        .spyOn(canvas.context, "fillText")
        .mockImplementation(() => {
          textBaseline = canvas.context.textBaseline;
        });

      const baselines: CanvasTextBaseline[] = [
        "alphabetic",
        "bottom",
        "hanging",
        "ideographic",
        "middle",
        "top",
      ];

      for (const [index, baseline] of baselines.entries()) {
        element.baseline = baseline;

        await waitFor(() => {
          expect(fillText).toHaveBeenCalledTimes(index + 1);

          expect(textBaseline).toBe(baseline);
        });
      }
    });

    test("reflection", () => {
      const { element } = setup();

      element.baseline = "top";

      testReflection(element, "baseline", "baseline", "bottom");
    });
  });

  test("text content renders", async () => {
    const { element, canvas } = setup();

    const fillText = jest.spyOn(canvas.context, "fillText");

    const textContent = "This is a test";

    element.textContent = textContent;

    await waitFor(() => {
      expect(fillText).toHaveBeenCalled();

      expect(fillText.mock.calls[0][0]).toBe(textContent);
    });
  });

  testStroke(setup, "strokeText", false);

  testFill(setup, "fillText", false);
});

import { expect, jest, test } from "@jest/globals";
import { testOffset } from "./testOffset";
import { createRoot } from "web-spinner";
import { testFill } from "./testFill";
import { testStroke } from "./testStroke";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { mockMatchMedia, testReflection } from "./shared";
import { testTransform } from "./testTransform";
import { waitFor } from "@testing-library/dom";

describe("c2d-shape", () => {
  setupJestCanvasMock();

  mockMatchMedia();

  const setup = () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    const shape = canvas.shape();

    return { canvas, element: shape };
  };

  describe("close", () => {
    test("close determines whether closePath is called", async () => {
      const { element, canvas } = setup();

      const render = jest.spyOn(element, "render");

      const closePath = jest.spyOn(canvas.context, "closePath");

      document.dispatchEvent(new Event("DOMContentLoaded"));

      await waitFor(() => {
        expect(render).toHaveBeenCalledTimes(1);

        expect(closePath).not.toHaveBeenCalled();
      });

      element.close = true;

      await waitFor(() => {
        expect(render).toHaveBeenCalledTimes(2);

        expect(closePath).toHaveBeenCalledTimes(1);
      });
    });

    test("close reflection", () => {
      const { element } = setup();

      element.close = true;

      testReflection(element, "close", "close", false);
    });
  });

  testOffset(setup, "moveTo");

  testTransform(setup);

  testFill(setup, "moveTo");

  testStroke(setup, "moveTo");
});

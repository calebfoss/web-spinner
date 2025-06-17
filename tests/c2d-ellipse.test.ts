import { expect, jest, test } from "@jest/globals";
import { mockMatchMedia } from "./shared";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { createRoot } from "web-spinner";
import { testTransform } from "./testTransform";
import { testRectangleBounds } from "./testRectangleBounds";
import { testStroke } from "./testStroke";
import { testFill } from "./testFill";

describe("c2d-ellipse", () => {
  mockMatchMedia();

  setupJestCanvasMock();

  const setup = () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    const ellipse = canvas.ellipse();

    return { canvas, element: ellipse };
  };

  testTransform(setup, "ellipse");

  testRectangleBounds(setup, "ellipse", 0.5);

  testStroke(setup, "ellipse");

  testFill(setup, "ellipse");
});

import { expect, jest, test } from "@jest/globals";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { createCanvas } from "web-spinner";

beforeEach(() => {
  jest.resetAllMocks();
  setupJestCanvasMock();
});

test("c2d-canvas", () => {
  const width = 1;

  const height = 2;

  const canvas = createCanvas({ width, height });

  expect(canvas.width).toBe(width);

  expect(canvas.height).toBe(height);
});

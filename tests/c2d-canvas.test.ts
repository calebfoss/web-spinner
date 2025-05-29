import { expect, jest, test } from "@jest/globals";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { Color, createCanvas } from "web-spinner";

beforeEach(() => {
  jest.resetAllMocks();
  setupJestCanvasMock();
});

const width = 150;

const height = 250;

function dimensions(element: { width: number; height: number }) {
  test("width and height initialized", () => {
    expect(element.width).toBe(width);

    expect(element.height).toBe(height);
  });

  test("width and height modified", () => {
    const change = 50;

    element.width += change;

    element.height += change;

    expect(element.width).toBe(width + change);

    expect(element.height).toBe(height + change);

    element.width -= change;

    element.height -= change;

    expect(element.width).toBe(width);

    expect(element.height).toBe(height);
  });
}

describe("c2d-canvas", () => {
  const background = Color.rgb(50, 100, 150);

  const canvas = createCanvas({ width, height, background });

  dimensions(canvas);

  test("background", () => {
    expect(canvas.background instanceof Color).toBe(true);

    expect(background.equals(canvas.background as Color)).toBe(true);
  });

  test("center", () => {
    expect(canvas.center.x).toBe(width / 2);

    expect(canvas.center.y).toBe(height / 2);
  });

  test("domCanvas", () => {
    expect(canvas.domCanvas instanceof HTMLCanvasElement).toBe(true);
  });

  test("context", () => {
    expect(canvas.context instanceof CanvasRenderingContext2D).toBe(true);
  });
});

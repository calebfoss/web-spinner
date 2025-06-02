import { expect, jest, test } from "@jest/globals";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { Color, createRoot } from "web-spinner";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

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

  const root = createRoot();

  const canvas = root.canvas2D({ width, height, background });

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

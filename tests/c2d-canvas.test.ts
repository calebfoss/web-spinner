import { expect, jest, test } from "@jest/globals";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { Color, createRoot } from "web-spinner";
import { testDimensions, testReflection } from "./sharedTests";

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

describe("c2d-canvas", () => {
  const width = 150;

  const height = 250;

  const background = Color.rgb(50, 100, 150);

  const root = createRoot();

  const canvas = root.canvas2D({ width, height, background });

  testDimensions(canvas, width, height);

  describe("alpha", () => {
    test("matches context", () => {
      expect(canvas.alpha).toBe(canvas.context.globalAlpha);
    });

    test("responds to changes", () => {
      const changedValue = 0.5;

      canvas.alpha = changedValue;

      expect(canvas.alpha).toBe(changedValue);

      expect(canvas.context.globalAlpha).toBe(changedValue);
    });

    testReflection(canvas, "alpha", "alpha", 0.75);
  });

  test("alpha", () => {});

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

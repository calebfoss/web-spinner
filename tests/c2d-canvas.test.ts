import { jest } from "@jest/globals";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { userEvent } from "@testing-library/user-event";
import { Color, createRoot, Vector2D } from "web-spinner";
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

  describe("addEventListener", () => {
    let receivedEvent: Event | null = null;
    const key = "a";

    afterEach(() => {
      receivedEvent = null;
    });

    const listener = (evt: Event) => {
      receivedEvent = evt;
    };

    test("keydown", async () => {
      canvas.addEventListener("keydown", listener);

      await userEvent.keyboard(key);

      expect((receivedEvent as KeyboardEvent).key).toBe(key);
    });

    test("keyup", async () => {
      canvas.addEventListener("keyup", listener);

      await userEvent.keyboard(key);

      expect((receivedEvent as KeyboardEvent).key).toBe(key);
    });
  });

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

  describe("background", () => {
    test("is an instance of the Color class by default", () => {
      expect(canvas.background instanceof Color).toBe(true);
    });

    test("value was set on creation", () => {
      expect(background.equals(canvas.background as Color)).toBe(true);
    });

    testReflection(canvas, "background", "background", Color.rgb(255, 0, 0));
  });

  test("center corresponds to dimensions", () => {
    expect(canvas.center.x).toBe(width / 2);

    expect(canvas.center.y).toBe(height / 2);
  });

  test("clicked", async () => {
    const user = userEvent.setup();

    await user.click(canvas.domCanvas);

    expect(canvas.clicked).toBe(true);
  });

  test("clickPosition", async () => {
    const user = userEvent.setup();

    const x = 45;

    const y = 75;

    await user.pointer([
      { target: canvas.domCanvas },
      {
        target: canvas.domCanvas,
        coords: { x, y },
        keys: "[MouseLeft]",
      },
    ]);

    expect(canvas.clickPosition.x).toBe(x);

    expect(canvas.clickPosition.y).toBe(y);
  });

  test("domCanvas", () => {
    expect(canvas.domCanvas instanceof HTMLCanvasElement).toBe(true);
  });

  test("context", () => {
    expect(canvas.context instanceof CanvasRenderingContext2D).toBe(true);
  });
});

import { beforeAll, jest } from "@jest/globals";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { userEvent } from "@testing-library/user-event";
import { Color, createRoot, Vector2D } from "web-spinner";
import {
  mockMatchMedia,
  sleep,
  testDimensions,
  testReflection,
} from "./shared";

mockMatchMedia();

describe("c2d-canvas", () => {
  const width = 150;

  const height = 250;

  const background = Color.rgb(50, 100, 150);

  let root = createRoot();

  let canvas = root.canvas2D({ width, height, background });

  beforeEach(() => {
    jest.resetAllMocks();

    mockMatchMedia();

    setupJestCanvasMock();

    root = createRoot();

    canvas = root.canvas2D({ width, height, background });
  });

  afterEach(() => {
    canvas.remove();

    root.remove();
  });

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

  test("animating", () => {
    expect(canvas.animating).toBe(false);

    canvas.everyFrame = () => {};

    expect(canvas.animating).toBe(true);
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

  describe("deltaTime", () => {
    test("Starts at 0", () => {
      expect(canvas.deltaTime).toBe(0);
    });

    test("Calculates time between frames", async () => {
      const ms = 125;

      canvas.queueRender();

      await sleep(ms);

      canvas.queueRender();

      await new Promise(requestAnimationFrame);

      expect(Math.abs(canvas.deltaTime - ms)).toBeLessThan(17);
    });
  });

  test("domCanvas", () => {
    expect(canvas.domCanvas instanceof HTMLCanvasElement).toBe(true);
  });

  test("context", () => {
    expect(canvas.context instanceof CanvasRenderingContext2D).toBe(true);
  });

  test("keyDown", async () => {
    const user = userEvent.setup();

    expect(canvas.keyDown).toBe(false);

    await user.keyboard("{a>}");

    expect(canvas.keyDown).toBe(true);

    await user.keyboard("{/a}");
  });
});

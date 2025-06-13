import { jest } from "@jest/globals";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { UserEvent, userEvent } from "@testing-library/user-event";
import { Color, createRoot } from "web-spinner";
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

  let user: UserEvent;

  beforeEach(() => {
    jest.resetAllMocks();

    mockMatchMedia();

    setupJestCanvasMock();

    root = createRoot();

    canvas = root.canvas2D({ width, height, background });

    user = userEvent.setup();
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
    await user.click(canvas.domCanvas);

    expect(canvas.clicked).toBe(true);
  });

  test("clickPosition", async () => {
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

  test("context", () => {
    expect(canvas.context instanceof CanvasRenderingContext2D).toBe(true);
  });

  describe("deltaTime", () => {
    test("Starts at 0", () => {
      expect(canvas.deltaTime).toBe(0);
    });

    test("Calculates time between frames", async () => {
      canvas.queueRender();

      await new Promise(requestAnimationFrame);

      const startTime = performance.now();

      await sleep(125);

      canvas.queueRender();

      await new Promise(requestAnimationFrame);

      const endTime = performance.now();

      const deltaTime = endTime - startTime;

      expect(Math.abs(canvas.deltaTime - deltaTime)).toBeLessThan(5);
    });
  });

  test("domCanvas", () => {
    expect(canvas.domCanvas instanceof HTMLCanvasElement).toBe(true);
  });

  test("everyFrame and frame", async () => {
    let framesRendered = 0;
    let lastFrame = -1;

    const everyFrame = jest.fn((currentFrame: number) => {
      framesRendered++;
      lastFrame = currentFrame;
    });

    canvas.everyFrame = everyFrame;

    await waitFor(() => {
      expect(lastFrame).toBeGreaterThan(20);

      expect(framesRendered).toBe(lastFrame);

      expect(canvas.frame).toBe(lastFrame);
    });
  });

  test("keyDown", async () => {
    expect(canvas.keyDown).toBe(false);

    const key = "a";

    await user.keyboard(`{${key}>}`);

    expect(canvas.keyDown).toBe(true);

    await user.keyboard(`{/${key}}`);
  });

  test("keyHeld and keyPreviouslyHeld", async () => {
    const key = "a";

    expect(canvas.keyHeld(key)).toBe(false);

    await user.keyboard(`{${key}>}`);

    expect(canvas.keyHeld(key)).toBe(true);

    expect(canvas.keyPreviouslyHeld(key)).toBe(false);

    canvas.everyFrame = jest.fn();

    await waitFor(async () => {
      expect(canvas.frame).toBeGreaterThan(20);

      expect(canvas.keyHeld(key)).toBe(true);

      expect(canvas.keyPreviouslyHeld(key)).toBe(true);

      await user.keyboard(`{/${key}}`);

      expect(canvas.keyHeld(key)).toBe(false);
    });
  });

  test("lastKey", async () => {
    expect(canvas.lastKey).toBe("");

    for (let cc = 65; cc < 91; cc++) {
      const key = String.fromCharCode(cc);

      await user.keyboard(key);

      expect(canvas.lastKey).toBe(key);
    }
  });

  test("queueRender", async () => {
    expect(canvas.frame).toBe(0);

    canvas.queueRender();

    await waitFor(() => {
      expect(canvas.frame).toBe(1);
    });
  });

  test("renderOn", async () => {
    expect(canvas.frame).toBe(0);

    canvas.renderOn("click");

    user.click(canvas);

    await waitFor(() => {
      expect(canvas.frame).toBe(1);
    });
  });
});

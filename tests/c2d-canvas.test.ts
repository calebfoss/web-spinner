import { jest } from "@jest/globals";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { userEvent } from "@testing-library/user-event";
import { Color, createRoot } from "web-spinner";
import { mockMatchMedia, setupMockTiming, testReflection } from "./shared";

describe("c2d-canvas", () => {
  mockMatchMedia();

  setupJestCanvasMock();

  const width = 150;

  const height = 250;

  const background = Color.rgb(50, 100, 150);

  const setup = () => {
    const root = createRoot();

    const canvas = root.canvas2D({ width, height, background });

    const user = userEvent.setup();

    return { user, canvas, root };
  };

  afterEach(() => {
    while (document.body.firstChild !== null) document.body.firstChild.remove();
  });

  describe("dimensions", () => {
    test("initialization", () => {
      const { canvas } = setup();

      expect(canvas.width).toBe(width);

      expect(canvas.height).toBe(height);
    });

    test("modification", () => {
      const { canvas } = setup();

      const change = 50;

      canvas.width += change;

      canvas.height += change;

      expect(canvas.width).toBe(width + change);

      expect(canvas.height).toBe(height + change);

      canvas.width -= change;

      canvas.height -= change;

      expect(canvas.width).toBe(width);

      expect(canvas.height).toBe(height);
    });

    test("reflection", () => {
      const { canvas } = setup();

      testReflection(canvas, "width", "width", width + 100);

      testReflection(canvas, "height", "height", width + 100);
    });
  });

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
      const { canvas, user } = setup();

      canvas.addEventListener("keydown", listener);

      await user.keyboard(key);

      expect((receivedEvent as KeyboardEvent).key).toBe(key);
    });

    test("keyup", async () => {
      const { canvas, user } = setup();

      canvas.addEventListener("keyup", listener);

      await user.keyboard(key);

      expect((receivedEvent as KeyboardEvent).key).toBe(key);
    });
  });

  describe("alpha", () => {
    test("matches context", () => {
      const { canvas } = setup();

      expect(canvas.alpha).toBe(canvas.context.globalAlpha);
    });

    test("responds to changes", () => {
      const { canvas } = setup();

      const changedValue = 0.5;

      canvas.alpha = changedValue;

      expect(canvas.alpha).toBe(changedValue);

      expect(canvas.context.globalAlpha).toBe(changedValue);
    });

    test("reflection", () => {
      const { canvas } = setup();

      testReflection(canvas, "alpha", "alpha", 0.75);
    });
  });

  test("animating", () => {
    const { canvas } = setup();

    expect(canvas.animating).toBe(false);

    canvas.everyFrame = () => {};

    expect(canvas.animating).toBe(true);
  });

  describe("background", () => {
    test("is an instance of the Color class by default", () => {
      const { canvas } = setup();

      expect(canvas.background instanceof Color).toBe(true);
    });

    test("value was set on creation", () => {
      const { canvas } = setup();

      expect(background.equals(canvas.background as Color)).toBe(true);
    });

    test("reflection", () => {
      const { canvas } = setup();

      testReflection(canvas, "background", "background", Color.rgb(255, 0, 0));
    });
  });

  test("center corresponds to dimensions", () => {
    const { canvas } = setup();

    expect(canvas.center.x).toBe(width / 2);

    expect(canvas.center.y).toBe(height / 2);
  });

  test("clicked", async () => {
    const { canvas, user } = setup();

    await user.click(canvas.domCanvas);

    expect(canvas.clicked).toBe(true);
  });

  test("clickPosition", async () => {
    const { canvas, user } = setup();

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
    const { canvas } = setup();

    expect(canvas.context instanceof CanvasRenderingContext2D).toBe(true);
  });

  describe("deltaTime", () => {
    test("Starts at 0", () => {
      const { canvas } = setup();

      expect(canvas.deltaTime).toBe(0);
    });

    test("Calculates time between frames", async () => {
      const { canvas } = setup();

      const fps = 60;

      setupMockTiming(canvas, fps);

      const everyFrame = jest.fn((frame) => {
        expect(canvas.deltaTime).toBe(1000 / fps);
      });

      canvas.everyFrame = everyFrame;

      await waitFor(() => {
        expect(everyFrame.mock.calls.length).toBeGreaterThanOrEqual(30);
      });
    });
  });

  test("domCanvas", () => {
    const { canvas } = setup();

    expect(canvas.domCanvas instanceof HTMLCanvasElement).toBe(true);
  });

  test("everyFrame and frame", async () => {
    const { canvas } = setup();

    let lastFrame = -1;

    const everyFrame = jest.fn((currentFrame: number) => {
      lastFrame = currentFrame;
    });

    canvas.everyFrame = everyFrame;

    await waitFor(() => {
      expect(lastFrame).toBeGreaterThan(20);

      expect(everyFrame.mock.calls.length).toBe(lastFrame + 1);

      expect(canvas.frame).toBe(lastFrame + 1);
    });
  });

  test("keyDown", async () => {
    const { canvas, user } = setup();

    expect(canvas.keyDown).toBe(false);

    const key = "a";

    await user.keyboard(`{${key}>}`);

    expect(canvas.keyDown).toBe(true);

    await user.keyboard(`{/${key}}`);
  });

  test("keyHeld and keyPreviouslyHeld", async () => {
    const { canvas, user } = setup();

    const key = "a";

    expect(canvas.keyHeld(key)).toBe(false);

    await waitFor(() => {
      expect(canvas.frame).toBe(1);
    });

    await user.keyboard(`{${key}>}`);

    let keyHeld: boolean | null = null;

    let keyPreviouslyHeld: boolean | null = null;

    jest.spyOn(canvas.context, "beginPath").mockImplementation(() => {
      keyHeld = canvas.keyHeld(key);

      keyPreviouslyHeld = canvas.keyPreviouslyHeld(key);
    });

    canvas.queueRender();

    await waitFor(() => {
      expect(canvas.frame).toBe(2);

      expect(keyHeld).toBe(true);

      expect(keyPreviouslyHeld).toBe(false);
    });

    keyHeld = null;

    keyPreviouslyHeld = null;

    canvas.queueRender();

    await waitFor(async () => {
      expect(canvas.frame).toBe(3);

      expect(keyHeld).toBe(true);

      expect(keyPreviouslyHeld).toBe(true);
    });

    keyHeld = null;

    await user.keyboard(`{/${key}}`);

    canvas.queueRender();

    await waitFor(() => {
      expect(canvas.frame).toBe(4);

      expect(keyHeld).toBe(false);
    });
  });

  test("lastKey", async () => {
    const { canvas, user } = setup();

    expect(canvas.lastKey).toBe("");

    for (let cc = 65; cc < 91; cc++) {
      const key = String.fromCharCode(cc);

      await user.keyboard(key);

      expect(canvas.lastKey).toBe(key);
    }
  });

  test("mouse", async () => {
    const { canvas, user } = setup();

    const { mouse } = canvas;

    expect(mouse.x).toBe(0);

    expect(mouse.y).toBe(0);

    expect(mouse.over).toBe(false);

    expect(mouse.buttonStates.every((state) => !state)).toBe(true);

    const x = 50;

    const y = 75;

    await user.pointer([
      { coords: { x: 0, y: 0 } },
      {
        target: canvas.domCanvas,
        coords: { x, y },
      },
    ]);

    expect(mouse.x).toBe(x);

    expect(mouse.y).toBe(y);

    expect(mouse.over).toBe(true);

    await user.pointer({ keys: "[MouseLeft>]" });

    expect(mouse.buttonStates[0]).toBe(true);

    expect(mouse.buttonStates[2]).toBe(false);

    await user.pointer({ keys: "[/MouseLeft][MouseRight>]" });

    expect(mouse.buttonStates[0]).toBe(false);

    expect(mouse.buttonStates[2]).toBe(true);
  });

  test("queueRender", async () => {
    const { canvas } = setup();

    expect(canvas.frame).toBe(0);

    canvas.queueRender();

    await waitFor(() => {
      expect(canvas.frame).toBe(1);
    });
  });

  test("renderOn", async () => {
    const { canvas, user } = setup();

    await waitFor(() => {
      expect(canvas.frame).toBe(1);
    });

    canvas.renderOn("click");

    await user.click(canvas.domCanvas);

    await waitFor(() => {
      expect(canvas.frame).toBe(2);
    });
  });

  test("waitFor", async () => {
    const { canvas, user } = setup();

    const waitElement = document.createElement("a");

    canvas.waitFor(waitElement, "click");

    const everyFrame = jest.fn();

    canvas.everyFrame = everyFrame;

    await new Promise(requestAnimationFrame);

    expect(everyFrame).not.toHaveBeenCalled();

    expect(canvas.frame).toBe(0);

    await user.click(waitElement);

    await waitFor(() => {
      expect(everyFrame).toHaveBeenCalled();

      expect(canvas.frame).toBeGreaterThan(0);
    });
  });
});

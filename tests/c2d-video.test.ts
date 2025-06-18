import { expect, jest, test } from "@jest/globals";
import { mockMatchMedia, testReflection } from "./shared";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { createRoot } from "web-spinner";
import { testOffset } from "./testOffset";
import { testRectangleBounds } from "./testRectangleBounds";
import { testTransform } from "./testTransform";

describe("c2d-video", () => {
  mockMatchMedia();

  setupJestCanvasMock();

  const videoWidth = 125;

  const videoHeight = 45;

  const setup = () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    const video = canvas.video();

    video.mediaElement.width = videoWidth;

    video.mediaElement.height = videoHeight;

    video.mediaElement.dispatchEvent(new Event("canplay"));

    return { canvas, element: video };
  };

  test("setting dimensions modifies mediaElement", () => {
    const { element } = setup();

    Object.defineProperties(element.mediaElement, {
      videoWidth: {
        get() {
          return videoWidth;
        },
      },
      videoHeight: {
        get() {
          return videoHeight;
        },
      },
    });

    const newWidth = 45;

    const newHeight = 125;

    element.width = newWidth;

    element.height = newHeight;

    expect(element.mediaElement.width).toBe(newWidth);

    expect(element.mediaElement.height).toBe(newHeight);

    expect(element.mediaWidth).toBe(videoWidth);

    expect(element.mediaHeight).toBe(videoHeight);
  });

  test("media element is instance of video element", () => {
    const { element } = setup();

    expect(element.mediaElement instanceof HTMLVideoElement).toBe(true);
  });

  test("source reflection", () => {
    const { element } = setup();

    element.source = "http://a.com/a.mp4";

    testReflection(element, "source", "source", "http://b.com/b.mp4");
  });

  testOffset(setup, "drawImage", { x: 1, y: 2 });

  testTransform(setup);

  testRectangleBounds(setup, "drawImage", 1, 3, 4);
});

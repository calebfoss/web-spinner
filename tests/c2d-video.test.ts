import { expect, jest, test } from "@jest/globals";
import { mockMatchMedia, mockMediaPlayback, testReflection } from "./shared";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { createRoot } from "web-spinner";
import { testOffset } from "./testOffset";
import { testRectangleBounds } from "./testRectangleBounds";
import { testTransform } from "./testTransform";
import { waitFor } from "@testing-library/dom";
import { testShadow } from "./testShadow";

describe("c2d-video", () => {
  mockMatchMedia();

  mockMediaPlayback();

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

    Object.defineProperties(video.mediaElement, {
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

    Object.defineProperties(video.mediaElement, {
      requestVideoFrameCallback: {
        value: jest.fn((callback: VideoFrameRequestCallback) => {
          requestAnimationFrame((time) =>
            callback(time, {
              expectedDisplayTime: 0,
              width: videoWidth,
              height: videoHeight,
              mediaTime: 0,
              presentationTime: 0,
              presentedFrames: 0,
            })
          );
        }),
      },
      cancelVideoFrameCallback: {
        value: jest.fn((callback: VideoFrameRequestCallback) => {}),
      },
    });

    return { canvas, element: video };
  };

  afterEach(() => {
    while (document.body.firstChild !== null) document.body.firstChild.remove();
  });

  test("setting dimensions modifies mediaElement", () => {
    const { element } = setup();

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

  describe("playback", () => {
    test("play", async () => {
      const { element, canvas } = setup();

      const play = jest.spyOn(element.mediaElement, "play");

      const drawVideo = jest.spyOn(canvas.context, "drawImage");

      element.play();

      await waitFor(() => {
        expect(play).toHaveBeenCalled();

        expect(drawVideo).toHaveBeenCalled();
      });
    });

    test("pause", async () => {
      const { element, canvas } = setup();

      const pause = jest.spyOn(element.mediaElement, "pause");

      element.pause();

      await waitFor(() => {
        expect(pause).toHaveBeenCalled();
      });
    });
  });

  testShadow(setup, "drawImage");
});

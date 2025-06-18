import { mockMatchMedia, testReflection } from "./shared";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { createRoot } from "web-spinner";
import { testTransform } from "./testTransform";
import { testRectangleBounds } from "./testRectangleBounds";
import { testOffset } from "./testOffset";

describe("c2d-image", () => {
  mockMatchMedia();

  setupJestCanvasMock();

  const imageWidth = 125;

  const imageHeight = 45;

  const setup = () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    const image = canvas.image();

    image.mediaElement.dispatchEvent(new Event("load"));

    image.mediaElement.width = imageWidth;

    image.mediaElement.height = imageHeight;

    return { canvas, element: image };
  };

  test("setting dimensions modifies mediaElement", () => {
    const { element } = setup();

    Object.defineProperties(element.mediaElement, {
      naturalWidth: {
        get() {
          return imageWidth;
        },
      },
      naturalHeight: {
        get() {
          return imageHeight;
        },
      },
    });

    const newWidth = 45;

    const newHeight = 125;

    element.width = newWidth;

    element.height = newHeight;

    expect(element.mediaElement.width).toBe(newWidth);

    expect(element.mediaElement.height).toBe(newHeight);

    expect(element.mediaWidth).toBe(imageWidth);

    expect(element.mediaHeight).toBe(imageHeight);
  });

  test("media element is instance of image element", () => {
    const { element } = setup();

    expect(element.mediaElement instanceof Image).toBe(true);
  });

  test("source reflection", () => {
    const { element } = setup();

    element.source = "http://a.com/a.jpg";

    testReflection(element, "source", "source", "http://b.com/b.jpg");
  });

  testOffset(setup, "drawImage", { x: 1, y: 2 });

  testTransform(setup);

  testRectangleBounds(setup, "drawImage", 1, 3, 4);
});

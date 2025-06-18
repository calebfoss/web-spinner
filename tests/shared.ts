import { jest } from "@jest/globals";
import { Canvas2DCanvasElement } from "../dist/types/elements/visual/canvas";

export function testReflection<
  E extends Element,
  P extends keyof E,
  T extends E[P],
  A extends string
>(
  element: E,
  propertyKey: P,
  attributeName: A,
  changedPropertyValue: T,
  currentAttributeValue: string | null = element[propertyKey] === null
    ? null
    : String(element[propertyKey]),
  changedAttributeValue: string | null = changedPropertyValue === null
    ? null
    : String(changedPropertyValue)
) {
  const startingValue = element[propertyKey];

  expect(element.getAttribute(attributeName)).toBe(currentAttributeValue);

  element[propertyKey] = changedPropertyValue;

  const newAttributeValue = element.getAttribute(attributeName);

  expect(newAttributeValue).toBe(changedAttributeValue);

  element[propertyKey] = startingValue;

  if (changedAttributeValue === null) element.removeAttribute(attributeName);
  else element.setAttribute(attributeName, changedAttributeValue);

  if (typeof changedPropertyValue === "object")
    expect(element[propertyKey]).toEqual(changedPropertyValue);
  else expect(element[propertyKey]).toBe(changedPropertyValue);
}

export function mockMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function setupMockTiming(canvas: Canvas2DCanvasElement, fps: number) {
  const msPerFrame = 1000 / fps;

  performance.now = jest.fn(() => canvas.frame * msPerFrame);

  Object.defineProperty(canvas, "deltaTime", {
    get() {
      return msPerFrame;
    },
    set() {},
  });
}

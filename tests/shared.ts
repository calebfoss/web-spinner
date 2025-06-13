import { jest } from "@jest/globals";

export function testDimensions(
  element: { width: number; height: number },
  width: number,
  height: number
) {
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
  currentAttributeValue: string | null = String(element[propertyKey]),
  changedAttributeValue: string | null = String(changedPropertyValue)
) {
  describe(`reflection`, () => {
    const currentValue = element[propertyKey];

    beforeEach(() => {
      element[propertyKey] = currentValue;
    });

    test("current value matches", () => {
      expect(element.getAttribute(attributeName)).toBe(currentAttributeValue);
    });

    test("attribute reflects when property value is changed", () => {
      element[propertyKey] = changedPropertyValue;

      const changedAttributeValue = element.getAttribute(attributeName);

      expect(changedAttributeValue).toBe(changedAttributeValue);
    });

    test("property value reflects when attribute is changed", () => {
      if (changedAttributeValue === null)
        element.removeAttribute(attributeName);
      else element.setAttribute(attributeName, changedAttributeValue);

      if (typeof changedPropertyValue === "object")
        expect(element[propertyKey]).toEqual(changedPropertyValue);
      else expect(element[propertyKey]).toBe(changedPropertyValue);
    });
  });
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

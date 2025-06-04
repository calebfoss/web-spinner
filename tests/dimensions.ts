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

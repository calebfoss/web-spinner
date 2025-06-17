import { Canvas2DRectangle } from "../dist/types/elements/visual/rectangle";
import { testReflection } from "./shared";
import { ElementTestSetup } from "./types";
import { Vector2D } from "web-spinner";

export function testRectangleBounds(
  setup: ElementTestSetup<{
    topLeft: Vector2D;
    topRight: Vector2D;
    bottomRight: Vector2D;
    bottomLeft: Vector2D;
    offset: Vector2D;
    width: number;
    height: number;
    center: Vector2D;
    origin: Canvas2DRectangle["origin"];
  }>
) {
  describe("rectangle bounds", () => {
    const { element } = setup();

    element.offset = Vector2D.xy(50, 65);

    element.width = 75;

    element.height = 85;

    test("with origin at top left", () => {
      element.origin = "topLeft";

      expect(element.topLeft).toEqual(element.offset);

      expect(element.topRight).toEqual(element.offset.plus(element.width, 0));

      expect(element.bottomRight).toEqual(
        element.offset.plus(element.width, element.height)
      );

      expect(element.bottomLeft).toEqual(
        element.offset.plus(0, element.height)
      );

      expect(element.center).toEqual(
        element.offset.plus(element.width / 2, element.height / 2)
      );
    });

    test("with origin at center", () => {
      element.origin = "center";

      expect(element.topLeft).toEqual(
        element.offset.minus(element.width / 2, element.height / 2)
      );

      expect(element.topRight).toEqual(
        element.offset.plus(element.width / 2, -element.height / 2)
      );

      expect(element.bottomRight).toEqual(
        element.offset.plus(element.width / 2, element.height / 2)
      );

      expect(element.bottomLeft).toEqual(
        element.offset.plus(-element.width / 2, element.height / 2)
      );

      expect(element.center).toEqual(element.offset);
    });

    test("reflection", () => {
      testReflection(element, "origin", "origin", "topLeft");
    });
  });
}

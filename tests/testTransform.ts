import { jest } from "@jest/globals";
import { Angle, Vector2D } from "web-spinner";
import { ElementTestSetup, VoidCanvasMethodNames } from "./types";
import { waitFor } from "@testing-library/dom";
import { testReflection } from "./shared";

export function testTransform(
  setup: ElementTestSetup<{
    anchor: Vector2D;
    angle: Angle;
    angularVelocity: Angle;
    scale: Vector2D;
  }>,
  renderFunctionName: VoidCanvasMethodNames
) {
  describe("transform", () => {
    test("anchor", async () => {
      const { element, canvas } = setup();

      const translate = jest.spyOn(canvas.context, "translate");

      const anchor = Vector2D.xy(45, 65);

      element.anchor = anchor;

      await waitFor(() => {
        expect(translate).toHaveBeenCalled();

        expect(translate.mock.calls[0]).toEqual([anchor.x, anchor.y]);
      });

      testReflection(element, "anchor", "anchor", Vector2D.xy(-65, -45));
    });

    test("angle", async () => {
      const { element, canvas } = setup();

      const rotate = jest.spyOn(canvas.context, "rotate");

      const angle = Angle.degrees(30);

      element.angle = angle;

      await waitFor(() => {
        expect(rotate).toHaveBeenCalled();

        expect(rotate.mock.calls[0][0]).toBe(angle.radians);
      });

      testReflection(element, "angle", "angle", Angle.degrees(-60));
    });

    test("angular velocity", async () => {
      const { element, canvas } = setup();

      const frames: { angle: number; ms: number }[] = [];

      const rotate = jest
        .spyOn(canvas.context, "rotate")
        .mockImplementation((angle) => {
          const ms = performance.now();

          frames.push({
            angle,
            ms,
          });
        });

      const angularVelocity = Angle.degrees(180);

      element.angularVelocity = angularVelocity;

      await waitFor(() => {
        expect(frames.length).toBeGreaterThan(30);

        for (let i = 1; i < frames.length; i++) {
          const frame = frames[i];

          const previous = frames[i - 1];

          const msPassed = frame.ms - previous.ms;

          const angleChange = frame.angle - previous.angle;

          expect(angleChange).toBeCloseTo(
            (msPassed * angularVelocity.radians) / 1000,
            1
          );
        }
      });
    });

    test("scale", async () => {
      const { element, canvas } = setup();

      const scale = jest.spyOn(canvas.context, "scale");

      const scaleValue = Vector2D.xy(1.5, 2.5);

      element.scale = scaleValue;

      await waitFor(() => {
        // The first time is for the canvas
        expect(scale).toHaveBeenCalledTimes(2);

        expect(scale.mock.calls[1]).toEqual([scaleValue.x, scaleValue.y]);
      });

      testReflection(element, "scale", "scale", Vector2D.xy(-2.5, -1.5));
    });
  });
}

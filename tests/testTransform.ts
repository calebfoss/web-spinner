import { jest } from "@jest/globals";
import { Angle, Vector2D } from "web-spinner";
import { ElementTestSetup, VoidCanvasMethodNames } from "./types";
import { waitFor } from "@testing-library/dom";
import { setupMockTiming, testReflection } from "./shared";

export function testTransform(
  setup: ElementTestSetup<{
    _applyMovement: (deltaTime: number) => void;
    anchor: Vector2D;
    angle: Angle;
    angularVelocity: Angle;
    scale: Vector2D;
    velocity: Vector2D;
  }>,
  transformedParents = 0
) {
  describe("transform", () => {
    test("anchor", async () => {
      const { element, canvas, teardown } = setup();

      const translate = jest.spyOn(canvas.context, "translate");

      const anchor = Vector2D.xy(45, 65);

      element.anchor = anchor;

      await waitFor(() => {
        expect(translate).toHaveBeenCalledTimes(1 + transformedParents);

        expect(translate.mock.calls[transformedParents]).toEqual([
          anchor.x,
          anchor.y,
        ]);
      });

      teardown();
    });

    test("anchor reflection", () => {
      const { element, teardown } = setup();

      element.anchor = Vector2D.xy(45, 65);

      testReflection(element, "anchor", "anchor", Vector2D.xy(-65, -45));

      teardown();
    });

    test("angle", async () => {
      const { element, canvas, teardown } = setup();

      const rotate = jest.spyOn(canvas.context, "rotate");

      const angle = Angle.degrees(30);

      element.angle = angle;

      await waitFor(() => {
        expect(rotate).toHaveBeenCalledTimes(1 + transformedParents);

        expect(rotate.mock.calls[transformedParents][0]).toBe(angle.radians);
      });

      teardown();
    });

    test("angle reflection", () => {
      const { element, teardown } = setup();

      element.angle = Angle.degrees(30);

      testReflection(element, "angle", "angle", Angle.degrees(-60));

      teardown();
    });

    test("angular velocity", async () => {
      const { element, canvas, teardown } = setup();

      const fps = 60;

      setupMockTiming(canvas, fps);

      const applyMovement = jest.spyOn(element, "_applyMovement");

      const angularVelocity = Angle.degrees(180);

      element.angularVelocity = angularVelocity;

      const rotationPerFrame = Angle.degrees(angularVelocity.degrees / fps);

      await waitFor(() => {
        const movedFrames = applyMovement.mock.calls.length - 1;

        const currentDegrees = element.angle.degrees;

        expect(movedFrames).toEqual(30);

        expect(currentDegrees).toBeCloseTo(
          rotationPerFrame.degrees * movedFrames
        );
      });

      teardown();
    });

    test("angular velocity reflection", () => {
      const { element, teardown } = setup();

      element.angularVelocity = Angle.degrees(30);

      testReflection(
        element,
        "angularVelocity",
        "angular-velocity",
        Angle.degrees(60)
      );

      teardown();
    });

    test("scale", async () => {
      const { element, canvas, teardown } = setup();

      const scale = jest.spyOn(canvas.context, "scale");

      const scaleValue = Vector2D.xy(1.5, 2.5);

      element.scale = scaleValue;

      await waitFor(() => {
        // The first time is for the canvas
        expect(scale).toHaveBeenCalledTimes(2 + transformedParents);

        expect(scale.mock.calls[1 + transformedParents]).toEqual([
          scaleValue.x,
          scaleValue.y,
        ]);
      });

      teardown();
    });

    test("scale reflection", () => {
      const { element, teardown } = setup();

      element.scale = Vector2D.xy(1.5, 2.5);

      testReflection(element, "scale", "scale", Vector2D.xy(-2.5, -1.5));

      teardown();
    });

    test("velocity", async () => {
      const { element, canvas, teardown } = setup();

      const fps = 60;

      setupMockTiming(canvas, fps);

      const velocity = Vector2D.xy(125, -175);

      const movementPerFrame = Vector2D.xy(velocity.x / fps, velocity.y / fps);

      const applyMovement = jest.spyOn(element, "_applyMovement");

      const movedFrames = 30;

      const { x, y } = await new Promise<{ x: number; y: number }>(
        (resolve) => {
          canvas.everyFrame = (frame: number) => {
            if (frame === movedFrames) {
              expect(applyMovement.mock.calls.length).toEqual(movedFrames);

              const { x, y } = element.anchor;

              resolve({ x, y });
            }
          };

          element.velocity = velocity;
        }
      );

      expect(x).toBeCloseTo(movementPerFrame.x * (movedFrames - 1), 0);

      expect(y).toBeCloseTo(movementPerFrame.y * (movedFrames - 1), 0);

      teardown();
    });

    test("velocity reflection", () => {
      const { element, teardown } = setup();

      element.velocity = Vector2D.xy(1, 2);

      testReflection(element, "velocity", "velocity", Vector2D.xy(3, 4));

      teardown();
    });
  });
}

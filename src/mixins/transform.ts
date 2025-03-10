import { Angle } from "../classes/angle";
import { MouseTracker } from "../classes/mouse";
import { Vector2D, Vector2DBase } from "../classes/vector2d";
import { Canvas2DCanvasElement } from "../elements/canvas2d/canvas";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";
import { isReadOnly } from "../utlities/readOnly";

const matchAngle = new RegExp(
  `(\d*)\s?(${Object.values(Angle.unit).join("|")})`
);

export function transformeable<B extends typeof Canvas2DBaseRenderable>(
  Base: B
) {
  return class Transformed extends Base {
    static observedAttributes: string[] = [
      ...Base.observedAttributes,
      "angle",
      "angular-velocity",
      "anchor",
      "scale",
      "velocity",
    ];

    #anchor = Vector2D.zero;
    #angle = Angle.radians(0);
    #angularVelocity = Angle.radians(0);
    #scale = Vector2D.one;
    #velocity = Vector2D.zero;

    constructor(...args: any[]) {
      super(...args);

      this.#angle.addChangeListener(this.#angleChangeListener);
    }

    #angleChangeListener: ChangeListener<number> = () => {
      this.registerChange("angle", this.#angle);
    };

    /**
     * Clockwise rotation of the element around its anchor.
     *
     * @attr
     * @reflect
     */
    get angle(): Angle {
      return this.#angle;
    }

    set angle(value) {
      this.#angle = this.#angle.replace(value, this.#angleChangeListener);
    }

    #angularVelocityChangedTime = -1;
    /**
     * Clockwise rotation per second.
     *
     * @attr angular-velocity
     * @reflect
     */
    get angularVelocity(): Angle {
      return this.#angularVelocity;
    }

    set angularVelocity(value) {
      if (this.#angularVelocity.equals(value)) {
        return;
      }

      this.#angularVelocityChangedTime = performance.now();

      this.registerChange("angularVelocity", (this.#angularVelocity = value));
    }

    /**
     * Base position of the element relative to its parent's anchor.
     *
     * @attr
     * @reflect
     */
    get anchor(): Vector2D {
      return this.#anchor;
    }

    #anchorChangeListener: ChangeListener<Vector2DBase> = () => {
      this.registerChange("anchor", this.#anchor);
    };

    set anchor(value) {
      this.#anchor = this.#anchor.replace(value, this.#anchorChangeListener);
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (newValue !== null) {
        switch (name) {
          case "angle":
            if (newValue === this.angle.toString()) return;
            this.angle = attributeParser.Angle(newValue);
            break;
          case "angular-velocity":
            if (newValue === this.angularVelocity.toString()) return;
            this.angularVelocity = attributeParser.Angle(newValue);
            break;
          case "anchor":
            const newAnchor = attributeParser.Vector2D(newValue);
            if (!this.#anchor.equals(newAnchor)) this.anchor = newAnchor;
            break;
          case "scale":
            const { x: scaleX, y: scaleY } = attributeParser.Vector2D(newValue);
            this.#scale.x = scaleX;
            this.#scale.y = scaleY;
            break;
          case "velocity":
            this.velocity = attributeParser.Vector2D(newValue);
            break;
        }
      }

      super.attributeChangedCallback(name, oldValue, newValue);
    }

    moveAnchor(x: number, y: number) {
      if (x === 0 && y === 0) return;

      this.#anchor.x += x;
      this.#anchor.y += y;

      this.registerChange("anchor", this.#anchor);
    }

    render(canvas2D: Canvas2DCanvasElement): void {
      super.render(canvas2D);

      const { context } = canvas2D;

      context.translate(this.#anchor.x, this.#anchor.y);
      context.rotate(this.#angle.radians);
      context.scale(this.#scale.x, this.#scale.y);
    }

    afterRender(canvas2D: Canvas2DCanvasElement): void {
      super.afterRender(canvas2D);

      const { deltaTime } = canvas2D;

      const now = performance.now();

      if (this.#angularVelocity.radians !== 0) {
        const angleChange =
          (this.#angularVelocity.radians *
            Math.min(deltaTime, now - this.#angularVelocityChangedTime)) /
          1000;

        this.angle.radians += angleChange;
      }

      if (this.#velocity.x !== 0 || this.#velocity.y !== 0) {
        const velocityDelta =
          Math.min(deltaTime, now - this.#velocityChangedTime) / 1000;

        if (isReadOnly(this.#anchor, "x") || isReadOnly(this.#anchor, "y"))
          this.#anchor = this.#anchor.copy();

        this.moveAnchor(
          this.#velocity.x * velocityDelta,
          this.#velocity.y * velocityDelta
        );
      }
    }

    rotateClockwise(angle: Angle) {
      this.angle = Angle.radians(this.#angle.radians + angle.radians);
    }

    rotateCounterclockwise(angle: Angle) {
      this.angle = Angle.radians(this.#angle.radians - angle.radians);
    }

    get scale() {
      return this.#scale;
    }

    set scale(value: Vector2D | number) {
      if (typeof value === "number") {
        const vectorValue = new Vector2D(value);

        if (this.#scale.equals(vectorValue)) return;

        this.registerChange("scale", (this.#scale = vectorValue));
      } else if (this.#scale.equals(value)) {
        return;
      } else {
        this.registerChange("scale", (this.#scale = value));
      }
    }

    #velocityChangedTime = -1;

    /**
     * Anchor movement per second.
     *
     * @attr
     * @reflect
     */
    get velocity(): Vector2D {
      return this.#velocity;
    }

    set velocity(value) {
      if (this.#velocity.equals(value)) return;

      this.registerChange("velocity", (this.#velocity = value));

      this.#velocityChangedTime = performance.now();
    }
  };
}

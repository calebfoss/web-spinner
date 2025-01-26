import { Angle } from "../classes/angle";
import { Vector2D } from "../classes/vector2d";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";

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

    #anchor = new Vector2D(0, 0);
    #angle = Angle.radians(0);
    #angularVelocity = Angle.radians(0);
    #scale = Vector2D.one;
    #velocity = Vector2D.zero;

    get angle() {
      return this.#angle;
    }

    set angle(value) {
      if (this.#angle.equals(value)) return;

      this.registerChange("angle", (this.#angle = value));
    }

    get angularVelocity() {
      return this.#angularVelocity;
    }

    set angularVelocity(value) {
      if (this.#angularVelocity.equals(value)) return;

      this.registerChange("angularVelocity", (this.#angularVelocity = value));
    }

    get anchor() {
      return this.#anchor;
    }

    set anchor(value) {
      if (this.#anchor.equals(value)) return;

      this.registerChange("anchor", (this.#anchor = value));
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (newValue !== null) {
        switch (name) {
          case "angle":
            this.angle = attributeParser.Angle(newValue);
            break;
          case "angular-velocity":
            this.angularVelocity = attributeParser.Angle(newValue);
            break;
          case "anchor":
            this.anchor = attributeParser.Vector2D(newValue);
            break;
          case "scale":
            this.scale = attributeParser.Vector2D(newValue);
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

    render(context: CanvasRenderingContext2D, frame: number): void {
      super.render(context, frame);

      context.translate(this.#anchor.x, this.#anchor.y);
      context.rotate(this.#angle.radians);
      context.scale(this.#scale.x, this.#scale.y);
    }

    afterRender(context: CanvasRenderingContext2D, frame: number): void {
      super.afterRender(context, frame);

      this.angle = Angle.radians(
        this.#angle.radians + this.#angularVelocity.radians
      );

      this.anchor = this.#anchor.plus(this.#velocity);
    }

    rotateClockwise(angle: Angle) {
      this.#angle.radians += angle.radians;

      this.registerChange("angle", this.#angle);
    }

    rotateCounterclockwise(angle: Angle) {
      this.#angle.radians -= angle.radians;

      this.registerChange("angle", this.#angle);
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

    get velocity() {
      return this.#velocity;
    }

    set velocity(value) {
      if (this.#velocity.equals(value)) return;

      this.registerChange("velocity", (this.#velocity = value));
    }
  };
}

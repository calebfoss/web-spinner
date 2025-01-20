import { Angle } from "../classes/angle";
import { Vector2D } from "../classes/vector2d";
import { Canvas2DRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";

const matchAngle = new RegExp(
  `(\d*)\s?(${Object.values(Angle.unit).join("|")})`
);

export function transformeable<B extends typeof Canvas2DRenderable>(Base: B) {
  return class Transformed extends Base {
    static observedAttributes: string[] = [
      ...Base.observedAttributes,
      "angle",
      "anchor",
      "scale",
    ];

    #anchor = new Vector2D(0, 0);
    #angle: Angle = Angle.radians(0);
    #position = new Vector2D(0, 0);
    #scale = Vector2D.one;

    get angle() {
      return this.#angle;
    }

    set angle(value) {
      this.#angle = value;
    }

    get anchor() {
      return this.#anchor;
    }

    set anchor(vector) {
      this.#anchor = vector;
    }

    attributeChangedCallback(
      name: string,
      oldValue: string,
      newValue: string
    ): void {
      switch (name) {
        case "angle":
          this.#angle = attributeParser.Angle(newValue);
          break;
        case "anchor":
          this.#anchor = attributeParser.Vector2D(newValue);
          break;
        case "position":
          this.#position = attributeParser.Vector2D(newValue);
          break;
        case "scale":
          this.#scale = attributeParser.Vector2D(newValue);
          break;
      }

      super.attributeChangedCallback(name, oldValue, newValue);
    }

    moveAnchor(x: number, y: number) {
      this.#anchor.x += x;
      this.#anchor.y += y;
    }

    movePosition(x: number, y: number) {
      this.#position.x += x;
      this.#position.y += y;
    }

    get position() {
      return this.#position;
    }

    set position(vector) {
      this.#position = vector;
    }

    render(context: CanvasRenderingContext2D, frame: number): void {
      super.render(context, frame);

      context.translate(this.#anchor.x, this.#anchor.y);
      context.rotate(this.#angle.radians);
      context.scale(this.#scale.x, this.#scale.y);
    }

    rotateClockwise(angle: Angle) {
      this.#angle.radians += angle.radians;
    }

    rotateCounterclockwise(angle: Angle) {
      this.#angle.radians -= angle.radians;
    }

    get scale() {
      return this.#scale;
    }

    set scale(value: Vector2D | number) {
      if (typeof value === "number") this.#scale = new Vector2D(value);
      else this.#scale = value;
    }
  };
}

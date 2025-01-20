import { Angle } from "../classes/angle";
import { Vector2D } from "../classes/vector2d";
import { Canvas2DRenderable } from "../elements/canvas2d/renderable";

export function transformeable<B extends typeof Canvas2DRenderable>(Base: B) {
  return class Transformed extends Base {
    #anchor = new Vector2D(0, 0);
    #angle: Angle = Angle.radians(0);
    #position = new Vector2D(0, 0);

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
    }

    rotateClockwise(angle: Angle) {
      this.#angle = Angle.radians(this.#angle.radians + angle.radians);
    }

    rotateCounterclockwise(angle: Angle) {
      this.#angle = Angle.radians(this.#angle.radians - angle.radians);
    }
  };
}

import { Vector2D } from "../classes/vector2d";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { hasDimensions } from "./dimensions";
import { positioned } from "./position";

export function hasRectangleBounds<B extends typeof Canvas2DBaseRenderable>(
  Base: B
) {
  return class extends hasDimensions(positioned(Base)) {
    get topLeft() {
      return this.position;
    }

    get topRight() {
      return Vector2D.xy(this.width - this.position.x, this.position.y);
    }

    get center() {
      return this.position.plus(Vector2D.xy(this.width / 2, this.height / 2));
    }

    get bottomLeft() {
      return Vector2D.xy(this.position.x, this.position.y + this.height);
    }

    get bottomRight() {
      return Vector2D.xy(
        this.position.x + this.width,
        this.position.y + this.height
      );
    }
  };
}

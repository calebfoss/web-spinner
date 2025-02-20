import { ConicalGradient } from "../classes/gradient";
import { Vector2D } from "../classes/vector2d";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { hasDimensions } from "./dimensions";
import { positioned } from "./position";

type Origin = "center" | "topLeft";

export function hasRectangleBounds<B extends typeof Canvas2DBaseRenderable>(
  Base: B
) {
  return class extends hasDimensions(positioned(Base)) {
    #origin: Origin = "topLeft";

    get topLeft() {
      switch (this.#origin) {
        case "topLeft":
          return this.position;
        case "center":
          return this.position.minus(this.width / 2, this.height / 2);
      }
      return this.position;
    }

    get topRight() {
      return this.topLeft.plus(this.width, 0);
    }

    get center() {
      switch (this.#origin) {
        case "topLeft":
          return this.position.plus(this.width / 2, this.height / 2);
        case "center":
          return this.position;
      }
    }

    get bottomLeft() {
      return this.topLeft.plus(0, this.height);
    }

    get bottomRight() {
      return this.topRight.plus(0, this.height);
    }

    get origin() {
      return this.#origin;
    }

    set origin(value) {
      this.#origin = value;
    }

    renderConicalGradient(
      context: CanvasRenderingContext2D,
      gradient: ConicalGradient
    ): CanvasGradient {
      return gradient.render(context, this.center);
    }
  };
}

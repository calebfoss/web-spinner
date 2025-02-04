import { Vector2D } from "../classes/vector2d";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { transformeable } from "./transform";

export function hasTo<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class extends transformeable(Base) {
    #to = Vector2D.xy(100, 100);

    get to() {
      return this.#to;
    }

    set to(value) {
      if (this.#to.equals(value)) return;

      this.registerChange("to", (this.#to = value));
    }
  };
}

export function hasFrom<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class extends Base {
    #from = Vector2D.zero;

    get from() {
      return this.#from;
    }

    set from(value) {
      if (this.#from.equals(value)) return;

      this.registerChange("from", (this.#from = value));
    }
  };
}

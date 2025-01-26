import { Canvas2DRenderable } from "../elements/canvas2d/renderable";

export function hasDimensions<B extends typeof Canvas2DRenderable>(Base: B) {
  return class extends Base {
    #width = 100;
    #height = 100;

    get width() {
      return this.#width;
    }

    set width(value) {
      this.#width = value;
    }

    get height() {
      return this.#height;
    }

    set height(value) {
      this.#height = value;
    }
  };
}

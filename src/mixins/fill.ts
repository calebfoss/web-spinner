import { Color } from "../classes/color";
import { Canvas2DRenderable } from "../elements/canvas2d/renderable";

export function fillable<B extends typeof Canvas2DRenderable>(Base: B) {
  return class Fillable extends Base {
    #fill: Color | None = Color.gray(32);

    get fill() {
      return this.#fill;
    }

    set fill(style) {
      this.#fill = style;
    }

    render(context: CanvasRenderingContext2D, frame: number): void {
      super.render(context, frame);

      if (this.#fill !== "none") context.fillStyle = this.#fill.hex;
    }

    afterRender(context: CanvasRenderingContext2D, frame: number): void {
      if (this.#fill !== "none") context.fill();

      super.afterRender(context, frame);
    }
  };
}

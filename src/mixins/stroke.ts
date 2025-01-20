import { Color } from "../classes/color";
import { Canvas2DRenderable } from "../elements/canvas2d/renderable";

export function strokeable<B extends typeof Canvas2DRenderable>(Base: B) {
  return class Strokeable extends Base {
    #stroke: Color | None = Color.gray(200);
    #width = 1;

    get stroke() {
      return this.#stroke;
    }

    set stroke(style) {
      this.#stroke = style;
    }

    render(context: CanvasRenderingContext2D, frame: number): void {
      super.render(context, frame);

      if (this.#stroke !== "none") context.strokeStyle = this.#stroke.hex;
    }

    afterRender(context: CanvasRenderingContext2D, frame: number): void {
      if (this.#stroke !== "none") context.stroke();

      super.afterRender(context, frame);
    }
  };
}

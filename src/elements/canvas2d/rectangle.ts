import { fillable } from "../../mixins/fill";
import { strokeable } from "../../mixins/stroke";
import { transformeable } from "../../mixins/transform";
import { Canvas2DRenderable } from "./renderable";

export class CanvasRectangle extends strokeable(
  fillable(transformeable(Canvas2DRenderable))
) {
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

  render(context: CanvasRenderingContext2D, frame: number): void {
    super.render(context, frame);

    const {
      position: { x, y },
      width,
      height,
    } = this;

    context.rect(x, y, width, height);

    this.afterRender(context, frame);
  }
}

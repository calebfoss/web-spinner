import { fillable } from "../../mixins/fill";
import { positioned } from "../../mixins/position";
import { strokeable } from "../../mixins/stroke";
import { transformeable } from "../../mixins/transform";
import { Canvas2DShapePartRenderable } from "./renderable";

export class Canvas2DShape extends fillable(
  strokeable(transformeable(positioned(Canvas2DShapePartRenderable)))
) {
  #close = false;

  get close() {
    return this.#close;
  }

  set close(value) {
    if (this.#close === value) return;

    this.registerChange("close", (this.#close = value));
  }

  render(context: CanvasRenderingContext2D, frame: number): void {
    super.render(context, frame);

    context.moveTo(this.position.x, this.position.y);

    this.renderChildren(context, frame);

    if (this.#close) context.closePath();

    this.afterRender(context, frame);
  }
}

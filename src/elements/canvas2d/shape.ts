import { MouseTracker } from "../../classes/mouse";
import { c2dFill } from "../../mixins/fill";
import { offset } from "../../mixins/offset";
import { strokeable } from "../../mixins/stroke";
import { transformeable } from "../../mixins/transform";
import { Canvas2DCanvasElement } from "./canvas";
import { Canvas2DShapePartRenderable } from "./renderable";

export class Canvas2DShape extends c2dFill(
  strokeable(transformeable(offset(Canvas2DShapePartRenderable)))
) {
  static get tag() {
    return "c2d-shape";
  }

  #close = false;

  get close() {
    return this.#close;
  }

  set close(value) {
    if (this.#close === value) return;

    this.registerChange("close", (this.#close = value));
  }

  render(canvas2D: Canvas2DCanvasElement): void {
    super.render(canvas2D);

    const { context } = canvas2D;

    context.moveTo(this.offset.x, this.offset.y);

    this.renderChildren(canvas2D);

    if (this.#close) context.closePath();

    this.afterRender(canvas2D);
  }
}

customElements.define("c2d-shape", Canvas2DShape);

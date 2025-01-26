import { hasDimensions } from "../../mixins/dimensions";
import { fillable } from "../../mixins/fill";
import { positioned } from "../../mixins/position";
import { strokeable } from "../../mixins/stroke";
import { transformeable } from "../../mixins/transform";
import {
  Canvas2DRenderable,
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "./renderable";

function renderCanvasRectangle<B extends typeof Canvas2DRenderable>(Base: B) {
  return class extends hasDimensions(transformeable(positioned(Base))) {
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
  };
}

export class Canvas2DShapeRectangle extends renderCanvasRectangle(
  Canvas2DShapePartRenderable
) {}

export class Canvas2DRectangle extends strokeable(
  fillable(renderCanvasRectangle(Canvas2DStandaloneRenderable))
) {}

import { fillable } from "../../mixins/fill";
import { hasRectangleBounds } from "../../mixins/rectangleBounds";
import { strokeable } from "../../mixins/stroke";
import { transformeable } from "../../mixins/transform";
import { Canvas2DCanvasElement } from "./canvas";
import {
  Canvas2DBaseRenderable,
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "./renderable";

function renderCanvasRectangle<B extends typeof Canvas2DBaseRenderable>(
  Base: B
) {
  return class extends transformeable(hasRectangleBounds(Base)) {
    render(canvas2D: Canvas2DCanvasElement): void {
      super.render(canvas2D);

      const {
        position: { x, y },
        width,
        height,
      } = this;

      canvas2D.context.rect(x, y, width, height);

      this.afterRender(canvas2D);
    }
  };
}

export class Canvas2DRectangle extends renderCanvasRectangle(
  strokeable(fillable(Canvas2DStandaloneRenderable))
) {}

export class Canvas2DShapeRectangle extends renderCanvasRectangle(
  Canvas2DShapePartRenderable
) {}

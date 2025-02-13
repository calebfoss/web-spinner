import { LinearGradient, RadialGradient } from "../../classes/gradient";
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

    renderLinearGradient(
      context: CanvasRenderingContext2D,
      gradient: LinearGradient
    ): CanvasGradient {
      const { x: x0, y: y0 } = this.position;

      const x1 = x0 + this.width;

      const y1 = y0 + this.height;

      return gradient.render(context, x0, y0, x1, y1);
    }

    renderRadialGradient(
      context: CanvasRenderingContext2D,
      gradient: RadialGradient
    ): CanvasGradient {
      const { x, y } = this.position;

      const centerX = x + this.width / 2;
      const centerY = y + this.height / 2;

      const radius = Math.max(this.width, this.height) / 2;

      return gradient.render(context, centerX, centerY, radius);
    }
  };
}

export class Canvas2DRectangle extends renderCanvasRectangle(
  strokeable(fillable(Canvas2DStandaloneRenderable))
) {}

export class Canvas2DShapeRectangle extends renderCanvasRectangle(
  Canvas2DShapePartRenderable
) {}

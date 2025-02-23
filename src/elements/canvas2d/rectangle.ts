import {
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "../../classes/gradient";
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
        topLeft: { x, y },
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
      const { x: x0, y: y0 } = this.topLeft;

      const { x: x1, y: y1 } = this.bottomRight;

      return gradient.render(context, x0, y0, x1, y1);
    }

    renderRadialGradient(
      context: CanvasRenderingContext2D,
      gradient: RadialGradient
    ): CanvasGradient {
      const radius = Math.max(this.width, this.height) / 2;

      const { x, y } = this.center;

      return gradient.render(context, x, y, radius);
    }
  };
}

export class Canvas2DRectangle extends renderCanvasRectangle(
  strokeable(fillable(Canvas2DStandaloneRenderable))
) {
  static get tag() {
    return "c2d-rectangle";
  }
}

customElements.define("c2d-rectangle", Canvas2DRectangle);

export class Canvas2DShapeRectangle extends renderCanvasRectangle(
  Canvas2DShapePartRenderable
) {
  static get tag() {
    return "c2d-shape-rectangle";
  }
}

customElements.define("c2d-shape-rectangle", Canvas2DShapeRectangle);

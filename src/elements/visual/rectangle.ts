import {
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "../../classes/gradient";
import { svgChildren } from "../../mixins/children";
import { svgDimensions } from "../../mixins/dimensions";
import { c2dFill, svgFill } from "../../mixins/fill";
import {
  c2dRectangleBounds,
  svgRectangleBounds,
} from "../../mixins/rectangleBounds";
import { c2dStroke, svgStroke } from "../../mixins/stroke";
import { c2dTransform, svgTransform } from "../../mixins/transform";
import { Canvas2DCanvasElement } from "./canvas";
import {
  Canvas2DBaseRenderable,
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "./renderable";
import { createSVGController } from "./svgBase";

function renderCanvasRectangle<B extends typeof Canvas2DBaseRenderable>(
  Base: B
) {
  return class extends c2dTransform(c2dRectangleBounds(Base)) {
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
  c2dStroke(c2dFill(Canvas2DStandaloneRenderable))
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

export class SVGRectangleController extends svgStroke(
  svgFill(
    svgDimensions(
      svgTransform(
        svgRectangleBounds(
          svgChildren(createSVGController("rect", "svg-rectangle"))
        )
      )
    )
  )
) {
  get origin() {
    return super.origin;
  }

  set origin(value) {
    super.origin = value;
  }
}

customElements.define("svg-rectangle", SVGRectangleController);

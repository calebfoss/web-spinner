import { Angle } from "../../classes/angle";
import { LinearGradient, RadialGradient } from "../../classes/gradient";
import { c2dFill } from "../../mixins/fill";
import { c2dRectangleBounds } from "../../mixins/rectangleBounds";
import { c2dStroke } from "../../mixins/stroke";
import { transformeable } from "../../mixins/transform";
import { Canvas2DCanvasElement } from "./canvas";
import {
  Canvas2DBaseRenderable,
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "./renderable";

function renderEllipse<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class extends transformeable(c2dRectangleBounds(Base)) {
    #startAngle = Angle.zero;
    #endAngle = Angle.radians(Math.PI * 2);

    constructor(...args: any[]) {
      super(...args);

      this.origin = "center";
    }

    render(canvas2D: Canvas2DCanvasElement): void {
      super.render(canvas2D);

      const { offset: position, width, height } = this;

      canvas2D.context.ellipse(
        position.x,
        position.y,
        width / 2,
        height / 2,
        0,
        this.#startAngle.radians,
        this.#endAngle.radians
      );

      this.afterRender(canvas2D);
    }

    renderRadialGradient(
      context: CanvasRenderingContext2D,
      gradient: RadialGradient
    ): CanvasGradient {
      const {
        offset: { x, y },
        width,
        height,
      } = this;

      const radius = Math.max(width, height) / 2;

      return gradient.render(context, x, y, radius);
    }

    get startAngle() {
      return this.#startAngle;
    }

    set startAngle(value) {
      if (this.#startAngle.equals(value)) return;

      this.registerChange("startAngle", (this.#startAngle = value));
    }

    get endAngle() {
      return this.#endAngle;
    }

    set endAngle(value) {
      if (this.#endAngle.equals(value)) return;

      this.registerChange("endAngle", (this.#endAngle = value));
    }
  };
}

export class Canvas2DEllipse extends renderEllipse(
  c2dStroke(c2dFill(Canvas2DStandaloneRenderable))
) {
  static get tag() {
    return "c2d-ellipse";
  }
}

customElements.define("c2d-ellipse", Canvas2DEllipse);

export class Canvas2DShapeEllipse extends renderEllipse(
  Canvas2DShapePartRenderable
) {
  static get tag() {
    return "c2d-shape-ellipse";
  }
}

customElements.define("c2d-shape-ellipse", Canvas2DShapeEllipse);

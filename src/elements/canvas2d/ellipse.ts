import { Angle } from "../../classes/angle";
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

function renderEllipse<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class extends transformeable(hasRectangleBounds(Base)) {
    #startAngle = Angle.zero;
    #endAngle = Angle.radians(Math.PI * 2);

    constructor(...args: any[]) {
      super(...args);

      this.origin = "center";
    }

    render(canvas2D: Canvas2DCanvasElement): void {
      super.render(canvas2D);

      const { position, width, height } = this;

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

    renderLinearGradient(
      context: CanvasRenderingContext2D,
      gradient: LinearGradient
    ): CanvasGradient {
      const { x: centerX, y: centerY } = this.position;

      const x0 = centerX - this.width / 2;
      const y0 = centerY - this.height / 2;

      return gradient.render(context, x0, y0, this.width, this.height);
    }

    renderRadialGradient(
      context: CanvasRenderingContext2D,
      gradient: RadialGradient
    ): CanvasGradient {
      const {
        position: { x, y },
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
  strokeable(fillable(Canvas2DStandaloneRenderable))
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

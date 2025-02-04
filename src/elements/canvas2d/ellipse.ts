import { Angle } from "../../classes/angle";
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

export class Canvas2DEllipse extends strokeable(
  fillable(renderEllipse(Canvas2DStandaloneRenderable))
) {}

export class Canvas2DShapeEllipse extends renderEllipse(
  Canvas2DShapePartRenderable
) {}

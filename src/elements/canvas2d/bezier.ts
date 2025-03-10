import { Vector2D } from "../../classes/vector2d";
import { fillable } from "../../mixins/fill";
import { strokeable } from "../../mixins/stroke";
import { hasFrom, hasTo } from "../../mixins/fromTo";
import {
  Canvas2DBaseRenderable,
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "./renderable";
import { Canvas2DCanvasElement } from "./canvas";
import { transformeable } from "../../mixins/transform";

function hasControlPoints<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class extends hasTo(Base) {
    #controlA = Vector2D.zero;
    #controlB = Vector2D.zero;

    get controlA() {
      return this.#controlA;
    }

    set controlA(value) {
      if (this.#controlA.equals(value)) return;

      this.registerChange("controlA", (this.#controlA = value));
    }

    get controlB() {
      return this.#controlB;
    }

    set controlB(value) {
      if (this.#controlB.equals(value)) return;

      this.registerChange("controlA", (this.#controlB = value));
    }
  };
}

export class Canvas2DShapeBezier extends hasControlPoints(
  Canvas2DShapePartRenderable
) {
  static get tag() {
    return "c2d-shape-bezier" as const;
  }

  render(canvas2D: Canvas2DCanvasElement): void {
    super.render(canvas2D);

    const { controlA, controlB, to } = this;

    canvas2D.context.bezierCurveTo(
      controlA.x,
      controlA.y,
      controlB.x,
      controlB.y,
      to.x,
      to.y
    );

    this.afterRender(canvas2D);
  }
}

customElements.define("c2d-shape-bezier", Canvas2DShapeBezier);

export class Canvas2DBezier extends strokeable(
  fillable(
    hasFrom(hasControlPoints(transformeable(Canvas2DStandaloneRenderable)))
  )
) {
  static get tag() {
    return "c2d-bezier";
  }

  render(canvas2D: Canvas2DCanvasElement): void {
    super.render(canvas2D);

    const { controlA, controlB, from, to } = this;

    canvas2D.context.moveTo(from.x, from.y);

    canvas2D.context.bezierCurveTo(
      controlA.x,
      controlA.y,
      controlB.x,
      controlB.y,
      to.x,
      to.y
    );

    this.afterRender(canvas2D);
  }
}

customElements.define("c2d-bezier", Canvas2DBezier);

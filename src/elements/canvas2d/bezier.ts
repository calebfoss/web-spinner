import { Vector2D } from "../../classes/vector2d";
import { fillable } from "../../mixins/fill";
import { strokeable } from "../../mixins/stroke";
import { hasFrom, hasTo } from "../../mixins/fromTo";
import {
  Canvas2DBaseRenderable,
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "./renderable";

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
  render(context: CanvasRenderingContext2D, frame: number): void {
    super.render(context, frame);

    const { controlA, controlB, to } = this;

    context.bezierCurveTo(
      controlA.x,
      controlA.y,
      controlB.x,
      controlB.y,
      to.x,
      to.y
    );

    this.afterRender(context, frame);
  }
}

export class Canvas2DBezier extends strokeable(
  fillable(hasFrom(hasControlPoints(Canvas2DStandaloneRenderable)))
) {
  render(context: CanvasRenderingContext2D, frame: number): void {
    super.render(context, frame);

    const { controlA, controlB, from, to } = this;

    context.moveTo(from.x, from.y);

    context.bezierCurveTo(
      controlA.x,
      controlA.y,
      controlB.x,
      controlB.y,
      to.x,
      to.y
    );

    this.afterRender(context, frame);
  }
}

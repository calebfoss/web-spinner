import { Vector2D } from "../../classes/vector2d";
import { strokeable } from "../../mixins/stroke";
import { hasFrom, hasTo } from "../../mixins/fromTo";
import {
  Canvas2DBaseRenderable,
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "./renderable";
import { Canvas2DCanvasElement } from "./canvas";
import {
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "../../classes/gradient";

export class Canvas2DShapeLine extends hasTo(Canvas2DShapePartRenderable) {
  render(canvas2D: Canvas2DCanvasElement): void {
    super.render(canvas2D);

    const { to } = this;

    canvas2D.context.lineTo(to.x, to.y);

    this.afterRender(canvas2D);
  }
}

export class Canvas2DLine extends strokeable(
  hasTo(hasFrom(Canvas2DStandaloneRenderable))
) {
  get center() {
    const width = this.to.x - this.from.x;
    const height = this.to.y - this.from.y;

    return Vector2D.xy(this.from.x + width / 2, this.from.y + height / 2);
  }

  render(canvas2D: Canvas2DCanvasElement): void {
    super.render(canvas2D);

    const { from, to } = this;

    canvas2D.context.moveTo(from.x, from.y);

    canvas2D.context.lineTo(to.x, to.y);

    this.afterRender(canvas2D);
  }

  renderConicalGradient(
    context: CanvasRenderingContext2D,
    gradient: ConicalGradient
  ): CanvasGradient {
    return gradient.render(context, this.center);
  }

  renderLinearGradient(
    context: CanvasRenderingContext2D,
    gradient: LinearGradient
  ): CanvasGradient {
    const { x, y } = this.from;

    const width = this.to.x - x;
    const height = this.to.y - y;

    return gradient.render(context, x, y, width, height);
  }

  renderRadialGradient(
    context: CanvasRenderingContext2D,
    gradient: RadialGradient
  ): CanvasGradient {
    const width = this.to.x - this.from.x;
    const height = this.to.y - this.from.y;
    const radius = Math.max(width, height) / 2;

    const { x, y } = this.center;

    return gradient.render(context, x, y, radius);
  }
}

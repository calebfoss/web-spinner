import { Vector2D } from "../../classes/vector2d";
import { strokeable } from "../../mixins/stroke";
import { hasFrom, hasTo } from "../../mixins/fromTo";
import {
  Canvas2DBaseRenderable,
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "./renderable";
import { Canvas2DCanvasElement } from "./canvas";
import { LinearGradient, RadialGradient } from "../../classes/gradient";

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
  render(canvas2D: Canvas2DCanvasElement): void {
    super.render(canvas2D);

    const { from, to } = this;

    canvas2D.context.moveTo(from.x, from.y);

    canvas2D.context.lineTo(to.x, to.y);

    this.afterRender(canvas2D);
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

    const centerX = this.from.x + width / 2;
    const centerY = this.from.y + height / 2;

    return gradient.render(context, centerX, centerY, radius);
  }
}

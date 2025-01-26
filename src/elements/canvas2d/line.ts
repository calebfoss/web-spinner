import { Vector2D } from "../../classes/vector2d";
import { strokeable } from "../../mixins/stroke";
import { hasFrom, hasTo } from "../../mixins/fromTo";
import {
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "./renderable";

export class Canvas2DShapeLine extends hasTo(Canvas2DShapePartRenderable) {
  render(context: CanvasRenderingContext2D, frame: number): void {
    super.render(context, frame);

    const { to } = this;

    context.lineTo(to.x, to.y);

    this.afterRender(context, frame);
  }
}

export class Canvas2DLine extends strokeable(
  hasTo(hasFrom(Canvas2DStandaloneRenderable))
) {
  render(context: CanvasRenderingContext2D, frame: number): void {
    super.render(context, frame);

    const { from, to } = this;

    context.moveTo(from.x, from.y);

    context.lineTo(to.x, to.y);

    this.afterRender(context, frame);
  }
}

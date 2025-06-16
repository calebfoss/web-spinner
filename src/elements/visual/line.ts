import { Vector2D } from "../../classes/vector2d";
import { c2dStroke } from "../../mixins/stroke";
import { hasFrom, hasTo } from "../../mixins/fromTo";
import { Canvas2DCanvasElement } from "./canvas";
import {
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "../../classes/gradient";
import {
  C2DShapePartTransformed,
  C2DStandaloneTransformed,
} from "../../mixins/transform";

export class Canvas2DShapeLine extends hasTo(C2DShapePartTransformed) {
  static get tag() {
    return "c2d-shape-line";
  }

  render(canvas2D: Canvas2DCanvasElement): void {
    super.render(canvas2D);

    const { to } = this;

    canvas2D.context.lineTo(to.x, to.y);

    this.afterRender(canvas2D);
  }
}

customElements.define("c2d-shape-line", Canvas2DShapeLine);

export class Canvas2DLine extends c2dStroke(
  hasTo(hasFrom(C2DStandaloneTransformed))
) {
  static get tag() {
    return "c2d-line";
  }

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

customElements.define("c2d-line", Canvas2DLine);

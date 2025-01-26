import { Vector2D } from "../../classes/vector2d";
import { strokeable } from "../../mixins/stroke";
import { transformeable } from "../../mixins/transform";
import {
  Canvas2DRenderable,
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "./renderable";

function hasTo<B extends typeof Canvas2DRenderable>(Base: B) {
  return class extends transformeable(Base) {
    #to = Vector2D.zero;

    get to() {
      return this.#to;
    }

    set to(value) {
      if (this.#to.equals(value)) return;

      this.registerChange("to", (this.#to = value));
    }
  };
}

export class Canvas2DShapeLine extends hasTo(Canvas2DShapePartRenderable) {
  render(context: CanvasRenderingContext2D, frame: number): void {
    super.render(context, frame);

    const { to } = this;

    context.lineTo(to.x, to.y);

    this.afterRender(context, frame);
  }
}

export class Canvas2DLine extends strokeable(
  hasTo(Canvas2DStandaloneRenderable)
) {
  #from = Vector2D.zero;

  get from() {
    return this.#from;
  }

  set from(value) {
    if (this.#from.equals(value)) return;

    this.registerChange("from", (this.#from = value));
  }

  render(context: CanvasRenderingContext2D, frame: number): void {
    super.render(context, frame);

    const { from, to } = this;

    context.moveTo(from.x, from.y);

    context.lineTo(to.x, to.y);

    this.afterRender(context, frame);
  }
}

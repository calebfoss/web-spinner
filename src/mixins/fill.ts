import { NONE } from "..";
import { Color } from "../classes/color";
import {
  ConicalGradient,
  DrawStyle,
  Gradient,
  LinearGradient,
  RadialGradient,
} from "../classes/gradient";
import { Canvas2DCanvasElement } from "../elements/canvas2d/canvas";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";

export function fillable<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class Fillable extends Base {
    static observedAttributes: string[] = [...Base.observedAttributes, "fill"];

    #fill: DrawStyle | null = null;

    get fill() {
      return this.#fill;
    }

    set fill(value) {
      if (this.#fill === value) return;

      if (
        this.#fill instanceof Color &&
        value instanceof Color &&
        this.#fill.equals(value)
      )
        return;

      this.registerChange("fill", (this.#fill = value));
    }

    render(canvas2D: Canvas2DCanvasElement): void {
      super.render(canvas2D);

      const { context } = canvas2D;

      if (this.#fill instanceof Color)
        context.fillStyle = this.#fill.toString();
      else if (this.#fill instanceof Gradient) {
        if (this.#fill instanceof ConicalGradient) {
          context.fillStyle = this.renderConicalGradient(context, this.#fill);
        } else if (this.#fill instanceof LinearGradient) {
          context.fillStyle = this.renderLinearGradient(context, this.#fill);
        } else if (this.#fill instanceof RadialGradient) {
          context.fillStyle = this.renderRadialGradient(context, this.#fill);
        }
      }
    }

    afterRender(canvas2D: Canvas2DCanvasElement): void {
      if (this.#fill !== "none") canvas2D.context.fill();

      super.afterRender(canvas2D);
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      if (name === "fill") {
        const fillValue =
          newValue === null ? NONE : attributeParser.FillStrokeStyle(newValue);

        if (fillValue !== "gradient") this.fill = fillValue;
      }

      super.attributeChangedCallback(name, oldValue, newValue);
    }
  };
}

import { NONE } from "..";
import { Color } from "../classes/color";
import { DrawStyle, LinearGradient } from "../classes/gradient";
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

      if (this.#fill instanceof LinearGradient) {
        canvas2D.context.fillStyle = this.renderLinearGradient(
          canvas2D.context,
          this.#fill
        );
      } else if (this.#fill !== "none" && this.#fill !== null)
        canvas2D.context.fillStyle = this.#fill.toString();
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

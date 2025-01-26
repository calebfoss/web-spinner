import { NONE } from "..";
import { Color } from "../classes/color";
import { Canvas2DRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";

export function fillable<B extends typeof Canvas2DRenderable>(Base: B) {
  return class Fillable extends Base {
    static observedAttributes: string[] = [...Base.observedAttributes, "fill"];

    #fill: Color | None | null = null;

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

    render(context: CanvasRenderingContext2D, frame: number): void {
      super.render(context, frame);

      if (this.#fill !== "none" && this.#fill !== null)
        context.fillStyle = this.#fill.toString();
    }

    afterRender(context: CanvasRenderingContext2D, frame: number): void {
      if (this.#fill !== "none") context.fill();

      super.afterRender(context, frame);
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      if (name === "fill")
        this.fill =
          newValue === null ? NONE : attributeParser.FillStrokeStyle(newValue);

      super.attributeChangedCallback(name, oldValue, newValue);
    }
  };
}

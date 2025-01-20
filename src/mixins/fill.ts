import { Color } from "../classes/color";
import { Canvas2DRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";

export function fillable<B extends typeof Canvas2DRenderable>(Base: B) {
  return class Fillable extends Base {
    static observedAttributes: string[] = [...Base.observedAttributes, "fill"];

    #fill: Color | None = Color.gray(32);

    get fill() {
      return this.#fill;
    }

    set fill(style) {
      this.#fill = style;
    }

    render(context: CanvasRenderingContext2D, frame: number): void {
      super.render(context, frame);

      if (this.#fill !== "none") context.fillStyle = this.#fill.string;
    }

    afterRender(context: CanvasRenderingContext2D, frame: number): void {
      if (this.#fill !== "none") context.fill();

      super.afterRender(context, frame);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (newValue !== null) {
        if (name === "fill") this.#fill = attributeParser.Color(newValue);
      }

      super.attributeChangedCallback(name, oldValue, newValue);
    }
  };
}

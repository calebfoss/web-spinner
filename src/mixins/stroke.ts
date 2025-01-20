import { Color } from "../classes/color";
import { Canvas2DRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";

export function strokeable<B extends typeof Canvas2DRenderable>(Base: B) {
  return class Strokeable extends Base {
    static observedAttributes: string[] = [
      ...Base.observedAttributes,
      "stroke",
    ];

    #stroke: Color | None = Color.gray(200);
    #lineWidth: number | null = null;

    get lineWidth() {
      return this.#lineWidth;
    }

    set lineWidth(value) {
      this.#lineWidth = value;
    }

    get stroke() {
      return this.#stroke;
    }

    set stroke(style) {
      this.#stroke = style;
    }

    render(context: CanvasRenderingContext2D, frame: number): void {
      super.render(context, frame);

      if (this.#stroke !== "none") context.strokeStyle = this.#stroke.string;
      if (this.#lineWidth !== null) context.lineWidth = this.#lineWidth;
    }

    afterRender(context: CanvasRenderingContext2D, frame: number): void {
      if (this.#stroke !== "none") context.stroke();

      super.afterRender(context, frame);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (newValue !== null) {
        if (name === "stroke") this.#stroke = attributeParser.Color(newValue);
      }

      super.attributeChangedCallback(name, oldValue, newValue);
    }
  };
}

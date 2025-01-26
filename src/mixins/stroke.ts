import { NONE } from "..";
import { Color } from "../classes/color";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";

export function strokeable<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class Strokeable extends Base {
    static observedAttributes: string[] = [
      ...Base.observedAttributes,
      "stroke",
    ];

    #stroke: Color | None | null = null;
    #lineWidth: number | null = null;

    get lineWidth() {
      return this.#lineWidth;
    }

    set lineWidth(value) {
      if (this.#lineWidth === value) return;

      this.registerChange("lineWidth", (this.#lineWidth = value));
    }

    get stroke() {
      return this.#stroke;
    }

    set stroke(value) {
      if (this.#stroke === value) return;

      if (
        this.#stroke instanceof Color &&
        value instanceof Color &&
        this.#stroke.equals(value)
      )
        return;

      this.registerChange("stroke", (this.#stroke = value));
    }

    render(context: CanvasRenderingContext2D, frame: number): void {
      super.render(context, frame);

      if (this.#stroke !== "none" && this.#stroke !== null)
        context.strokeStyle = this.#stroke.toString();
      if (this.#lineWidth !== null) context.lineWidth = this.#lineWidth;
    }

    afterRender(context: CanvasRenderingContext2D, frame: number): void {
      if (this.#stroke !== "none") context.stroke();

      super.afterRender(context, frame);
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      switch (name) {
        case "stroke":
          this.stroke =
            newValue === null
              ? NONE
              : attributeParser.FillStrokeStyle(newValue);
          break;
        case "line-width":
          this.lineWidth =
            newValue === null ? null : attributeParser.number(newValue);
          break;
      }

      super.attributeChangedCallback(name, oldValue, newValue);
    }
  };
}

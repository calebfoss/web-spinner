import { useFont } from "../../mixins/font";
import { fillable } from "../../mixins/fill";
import { strokeable } from "../../mixins/stroke";
import { transformeable } from "../../mixins/transform";
import { attributeParser } from "../../utlities/attributeParser";
import { Canvas2DRenderable } from "./renderable";

const Base = fillable(strokeable(transformeable(useFont(Canvas2DRenderable))));

export class Canvas2DText extends Base {
  static observedAttributes = [
    ...Base.observedAttributes,
    "size",
    "align",
    "baseline",
    "font",
    "stretch",
  ];

  #align: CanvasTextAlign | null = null;
  #baseline: CanvasTextBaseline | null = null;

  get align() {
    return this.#align;
  }

  set align(value) {
    if (this.#align === value) return;

    this.registerChange("align", (this.#align = value));
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (newValue === null)
      return super.attributeChangedCallback(name, oldValue, newValue);

    switch (name) {
      case "align":
        this.align = newValue as CanvasTextAlign;
        return;
      case "baseline":
        this.baseline = newValue as CanvasTextBaseline;
        return;
      default:
        return super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  get baseline() {
    return this.#baseline;
  }

  set baseline(value) {
    if (this.#baseline === value) return;

    this.registerChange("baseline", (this.#baseline = value));
  }

  render(context: CanvasRenderingContext2D, frame: number): void {
    super.render(context, frame);

    if (this.#align !== null) context.textAlign = this.#align;

    if (this.fill !== "none" && this.textContent !== null)
      context.fillText(this.textContent, this.position.x, this.position.y);

    if (this.stroke !== "none" && this.textContent !== null)
      context.strokeText(this.textContent, this.position.x, this.position.y);

    this.afterRender(context, frame);
  }
}

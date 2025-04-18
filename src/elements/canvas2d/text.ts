import { useFont } from "../../mixins/font";
import { c2dFill } from "../../mixins/fill";
import { c2dStroke } from "../../mixins/stroke";
import { transformeable } from "../../mixins/transform";
import { Canvas2DStandaloneRenderable, changedEvent } from "./renderable";
import { offset } from "../../mixins/offset";
import { Canvas2DCanvasElement } from "./canvas";
import { LinearGradient, RadialGradient } from "../../classes/gradient";

class Base extends c2dFill(
  c2dStroke(transformeable(offset(useFont(Canvas2DStandaloneRenderable))))
) {}

export class Canvas2DText extends Base {
  static observedAttributes = [
    ...Base.observedAttributes,
    "size",
    "align",
    "baseline",
    "font",
    "stretch",
  ];

  static get tag() {
    return "c2d-text";
  }

  #align: CanvasTextAlign | null = null;
  #baseline: CanvasTextBaseline | null = null;

  /**
   * Horizontal alignment. Options are "center", "end", "left", "right", or "start".
   *
   * @attr
   * @reflect
   */
  get align(): CanvasTextAlign | null {
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

  render(canvas2D: Canvas2DCanvasElement): void {
    super.render(canvas2D);

    const { context } = canvas2D;

    if (this.#align !== null) context.textAlign = this.#align;

    if (this.fill !== "none" && this.textContent !== null)
      context.fillText(this.textContent, this.offset.x, this.offset.y);

    if (this.stroke !== "none" && this.textContent !== null)
      context.strokeText(this.textContent, this.offset.x, this.offset.y);

    this.afterRender(canvas2D);

    this.renderChildren(canvas2D);
  }

  renderLinearGradient(
    context: CanvasRenderingContext2D,
    gradient: LinearGradient
  ): CanvasGradient {
    const textToMeasure = this.textContent ?? "";

    const measurements = context.measureText(textToMeasure);

    const {
      actualBoundingBoxAscent,
      actualBoundingBoxDescent,
      actualBoundingBoxLeft: x,
      actualBoundingBoxRight: y,
      width,
    } = measurements;

    const height = actualBoundingBoxDescent + actualBoundingBoxAscent;

    return gradient.render(context, x, y, width, height);
  }

  renderRadialGradient(
    context: CanvasRenderingContext2D,
    gradient: RadialGradient
  ): CanvasGradient {
    const textToMeasure = this.textContent ?? "";

    const measurements = context.measureText(textToMeasure);

    const {
      actualBoundingBoxAscent,
      actualBoundingBoxDescent,
      actualBoundingBoxLeft,
      actualBoundingBoxRight,
      width,
    } = measurements;

    const height = actualBoundingBoxAscent + actualBoundingBoxDescent;

    const radius = Math.max(height, width) / 2;

    const centerX = actualBoundingBoxLeft + width / 2;
    const centerY = actualBoundingBoxRight + height / 2;

    return gradient.render(context, centerX, centerY, radius);
  }

  get textContent() {
    return super.textContent;
  }

  set textContent(value) {
    if (super.textContent === value) return;

    super.textContent = value;

    this.dispatchEvent(changedEvent);
  }
}

customElements.define("c2d-text", Canvas2DText);

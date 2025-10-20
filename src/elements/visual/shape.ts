import { c2dFill } from "../../mixins/fill";
import { offset } from "../../mixins/offset";
import { c2dStroke } from "../../mixins/stroke";
import { C2DShapePartTransformed } from "../../mixins/transform";
import { attributeParser } from "../../utlities/attributeParser";
import { Canvas2DCanvasElement } from "./canvas";

export class Canvas2DShape extends c2dFill(
  c2dStroke(offset(C2DShapePartTransformed))
) {
  #close = false;

  static observedAttributes = [...super.observedAttributes, "close"];

  static get tag() {
    return "c2d-shape";
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (name === "close") {
      if (newValue === null) this.close = false;
      else this.close = attributeParser.boolean(newValue);
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get close() {
    return this.#close;
  }

  set close(value) {
    if (this.#close === value) return;

    this.registerChange("close", (this.#close = value));
  }

  render(canvas2D: Canvas2DCanvasElement): void {
    super.render(canvas2D);

    const { context } = canvas2D;

    context.beginPath();

    context.moveTo(this.offset.x, this.offset.y);

    super.renderChildren(canvas2D);

    if (this.#close) context.closePath();

    this.afterRender(canvas2D);
  }

  // This is empty to prevent double rendering children
  renderChildren(canvas2D: Canvas2DCanvasElement): void {}
}

customElements.define("c2d-shape", Canvas2DShape);

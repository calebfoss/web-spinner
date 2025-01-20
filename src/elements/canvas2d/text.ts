import { FontSize } from "../..";
import { Font, FontSizeUnit } from "../../classes/font";
import { fillable } from "../../mixins/fill";
import { strokeable } from "../../mixins/stroke";
import { transformeable } from "../../mixins/transform";
import { Canvas2DRenderable } from "./renderable";

export class Canvas2DText extends fillable(
  strokeable(transformeable(Canvas2DRenderable))
) {
  #font: Font | null = null;

  createFont(...args: ConstructorParameters<typeof Font>) {
    return new Font(...args);
  }

  get font() {
    return this.#font;
  }

  set font(font) {
    this.#font = font;
  }

  render(context: CanvasRenderingContext2D, frame: number): void {
    super.render(context, frame);

    if (this.#font !== null) context.font = this.#font.toString();

    if (this.fill !== "none")
      context.fillText(
        this.textContent ?? "",
        this.position.x,
        this.position.y
      );

    if (this.stroke !== "none")
      context.strokeText(
        this.textContent ?? "",
        this.position.x,
        this.position.y
      );

    this.afterRender(context, frame);
  }

  setFont(...args: ConstructorParameters<typeof Font>) {
    this.#font = this.createFont(...args);
  }

  set pixleSize(value: number) {
    const size = new FontSize(value, "px");

    if (this.#font === null) {
      this.setFont({ size });
    } else this.#font.size = size;
  }

  setSize(value: number, unit: FontSizeUnit) {
    const size = new FontSize(value, unit);

    if (this.#font === null) this.setFont({ size });
    else this.#font.size = size;
  }
}

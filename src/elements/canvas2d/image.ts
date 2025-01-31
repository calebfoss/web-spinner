import { hasRectangleBounds } from "../../mixins/rectangleBounds";
import { transformeable } from "../../mixins/transform";
import { Canvas2DCanvasElement } from "./canvas";
import { Canvas2DStandaloneRenderable } from "./renderable";

export class Canvas2DImage extends transformeable(
  hasRectangleBounds(Canvas2DStandaloneRenderable)
) {
  #imageElement = new Image();
  #widthSet = false;
  #heightSet = false;

  connectedCallback() {
    this.canvas.waitFor(this.#imageElement);
  }

  get source() {
    return this.#imageElement.src;
  }

  set source(value) {
    if (value === this.#imageElement.src) return;

    this.registerChange("source", (this.#imageElement.src = value));

    this.#imageElement.addEventListener("load", () => {
      if (this.#widthSet) {
        if (this.#heightSet) return;

        const widthRatio = this.width / this.#imageElement.naturalWidth;

        this.height *= widthRatio;
      } else if (this.#heightSet) {
        const heightRatio = this.height / this.#imageElement.naturalHeight;

        this.width *= heightRatio;
      }
    });
  }

  render(canvas2D: Canvas2DCanvasElement): void {
    super.render(canvas2D);

    canvas2D.context.drawImage(
      this.#imageElement,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    this.afterRender(canvas2D);
  }

  get width() {
    return this.#imageElement.width;
  }

  set width(value) {
    if (value === this.#imageElement.width) return;

    this.#widthSet = true;

    this.registerChange("width", (this.#imageElement.width = value));

    if (this.#heightSet || this.#imageElement.naturalWidth === 0) return;

    const widthRatio = value / this.#imageElement.naturalWidth;

    this.height = this.#imageElement.naturalHeight * widthRatio;
  }

  get height() {
    return this.#imageElement.height;
  }

  set height(value) {
    if (value === this.#imageElement.height) return;

    this.#heightSet = true;

    this.registerChange("height", (this.#imageElement.height = value));

    if (this.#widthSet || this.#imageElement.naturalHeight === 0) return;

    const heightRatio = value / this.#imageElement.naturalHeight;

    this.width = this.#imageElement.naturalWidth * heightRatio;
  }
}

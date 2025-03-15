import { Canvas2DCanvasElement } from "../elements/canvas2d/canvas";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";
import { hasRectangleBounds } from "./rectangleBounds";
import { transformeable } from "./transform";

export function rendersVisualMedia<
  B extends typeof Canvas2DBaseRenderable,
  T extends "img" | "video"
>(Base: B, mediaTag: T) {
  return class extends transformeable(hasRectangleBounds(Base)) {
    static observedAttributes = [...super.observedAttributes, "source"];

    #mediaElement: HTMLElementTagNameMap[T];
    #widthSet = false;
    #heightSet = false;

    constructor(...args: any[]) {
      super(...args);

      this.#mediaElement = document.createElement(mediaTag);
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (newValue === null)
        return super.attributeChangedCallback(name, oldValue, newValue);

      switch (name) {
        case "source":
          this.source = newValue;
          return;

        case "width":
          this.width = attributeParser.number(newValue);
          return;

        case "height":
          this.height = attributeParser.number(newValue);
          return;

        default:
          return super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    connectedCallback() {
      this.canvas.waitFor(
        this.#mediaElement,
        mediaTag === "video" ? "canplay" : "load"
      );
    }

    get mediaElement() {
      return this.#mediaElement;
    }

    /**
     * URL or local path to the media file source for this element.
     *
     * @attr
     * @reflect
     */
    get source(): string {
      return this.#mediaElement.src;
    }

    set source(value) {
      if (value === this.#mediaElement.src) return;

      this.registerChange("source", (this.#mediaElement.src = value));

      this.#mediaElement.addEventListener(
        mediaTag === "img" ? "load" : "canplay",
        () => {
          if (this.#widthSet) {
            if (this.#heightSet) return;

            const widthRatio = this.width / this.mediaWidth;

            this.height *= widthRatio;
          } else if (this.#heightSet) {
            const heightRatio = this.height / this.mediaHeight;

            this.width *= heightRatio;
          } else {
            this.width = this.mediaWidth;
            this.height = this.mediaHeight;
          }
        }
      );
    }

    render(canvas2D: Canvas2DCanvasElement): void {
      super.render(canvas2D);

      canvas2D.context.drawImage(
        this.#mediaElement,
        this.topLeft.x,
        this.topLeft.y,
        this.width,
        this.height
      );

      canvas2D.context.rect(
        this.topLeft.x,
        this.topLeft.y,
        this.width,
        this.height
      );

      this.afterRender(canvas2D);
    }

    get mediaWidth() {
      return this.#mediaElement instanceof HTMLImageElement
        ? this.#mediaElement.naturalWidth
        : this.#mediaElement.videoWidth;
    }

    get width() {
      return this.#mediaElement.width;
    }

    set width(value) {
      if (value === this.#mediaElement.width) return;

      this.#widthSet = true;

      this.registerChange("width", (this.#mediaElement.width = value));

      if (this.#heightSet || this.mediaWidth === 0) return;

      const widthRatio = value / this.mediaWidth;

      this.height = this.mediaHeight * widthRatio;
    }

    get mediaHeight() {
      return this.#mediaElement instanceof HTMLImageElement
        ? this.#mediaElement.naturalHeight
        : this.#mediaElement.videoHeight;
    }

    get height() {
      return this.#mediaElement.height;
    }

    set height(value) {
      if (value === this.#mediaElement.height) return;

      this.#heightSet = true;

      this.registerChange("height", (this.#mediaElement.height = value));

      if (this.#widthSet || this.mediaHeight === 0) return;

      const heightRatio = value / this.mediaHeight;

      this.width = this.mediaWidth * heightRatio;
    }
  };
}

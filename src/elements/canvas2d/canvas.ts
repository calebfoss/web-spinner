import { Color } from "../../classes/color";
import { Canvas2DElement } from "./element";
import { Canvas2DRenderable } from "./renderable";

export class Canvas2DCanvasElement extends Canvas2DElement {
  #animating = false;
  #background: Color | None = "none";
  #context: CanvasRenderingContext2D;
  #frame = 0;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    const canvas = document.createElement("canvas");

    shadowRoot.appendChild(canvas);

    const context = canvas.getContext("2d");

    if (context === null) throw new Error("Null context");

    this.#context = context;
  }

  get background() {
    return this.#background;
  }

  set background(color) {
    this.#background = color;
  }

  connectedCallback() {
    this.canvas.style.scale = `${1 / devicePixelRatio}`;
  }

  get canvas() {
    return this.#context.canvas;
  }

  get context() {
    return this.#context;
  }

  get everyFrame() {
    return super.everyFrame;
  }

  set everyFrame(updater: Updater | null) {
    super.everyFrame = updater;

    if (updater === null) return;

    this.#animating = true;

    this.render();
  }

  get width() {
    return this.canvas.width / devicePixelRatio;
  }

  set width(value) {
    this.canvas.width = value * devicePixelRatio;
  }

  get height() {
    return this.canvas.width / devicePixelRatio;
  }

  set height(value) {
    this.canvas.height = value * devicePixelRatio;
  }

  render() {
    this.#frame++;

    const context = this.#context;

    context.save();

    this.everyFrame?.(this.#frame);

    context.scale(devicePixelRatio, devicePixelRatio);

    if (this.#background !== "none") {
      context.save();

      context.fillStyle = this.#background.string;

      context.fillRect(0, 0, this.width, this.height);

      context.restore();
    }

    for (const child of this.children) {
      if (child instanceof Canvas2DRenderable) {
        child.render(context, this.#frame);
      }
    }

    context.restore();

    if (this.#animating) requestAnimationFrame(this.render.bind(this));
  }
}

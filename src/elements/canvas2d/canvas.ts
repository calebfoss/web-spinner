import { Color } from "../../classes/color";
import { standaloneChildren } from "../../mixins/children";
import { attributeParser } from "../../utlities/attributeParser";
import { Canvas2DElement } from "./element";
import { Canvas2DBaseRenderable } from "./renderable";

export class Canvas2DCanvasElement extends standaloneChildren(Canvas2DElement) {
  static observedAttributes: string[] = [
    ...Canvas2DElement.observedAttributes,
    "width",
    "height",
    "background",
  ];

  #animating = false;
  #background: Color | None = "none";
  #context: CanvasRenderingContext2D;
  #frame = 0;
  #renderQueued = false;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    const canvas = document.createElement("canvas");

    shadowRoot.appendChild(canvas);

    const context = canvas.getContext("2d");

    if (context === null) throw new Error("Null context");

    this.#context = context;
  }

  get animating() {
    return this.#animating;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (newValue !== null) {
      switch (name) {
        case "width":
          this.width = attributeParser.number(newValue);
          break;

        case "height":
          this.height = attributeParser.number(newValue);
          break;

        case "background":
          this.#background = attributeParser.Color(newValue);
          break;
      }
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get background() {
    return this.#background;
  }

  set background(color) {
    this.#background = color;
  }

  connectedCallback() {
    this.canvas.style.scale = `${1 / devicePixelRatio}`;

    document.addEventListener("DOMContentLoaded", this.render.bind(this));

    this.addEventListener("change", this.queueRender.bind(this));
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

  queueRender() {
    if (this.#renderQueued) return;

    this.#renderQueued = true;

    requestAnimationFrame(this.render.bind(this));
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

      context.fillStyle = this.#background.toString();

      context.fillRect(0, 0, this.width, this.height);

      context.restore();
    }

    for (const child of this.children) {
      if (child instanceof Canvas2DBaseRenderable) {
        child.render(context, this.#frame);
      }
    }

    context.restore();

    this.#renderQueued = false;

    if (this.#animating) this.queueRender();
  }
}

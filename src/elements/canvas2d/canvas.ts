import { Vector2D } from "../..";
import { ClickTracker } from "../../classes/click";
import { Color } from "../../classes/color";
import { KeyboardTracker } from "../../classes/keyboard";
import { MouseTracker } from "../../classes/mouse";
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
  #clickTracker: ClickTracker;
  #context: CanvasRenderingContext2D;
  #frame = 0;
  #keyboardTracker = new KeyboardTracker();
  #mouseTracker: MouseTracker;
  #renderEvents = new Set<keyof HTMLElementEventMap>();
  #renderQueued = false;
  #waitFor = new Set<Element>();

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    const canvas = document.createElement("canvas");

    shadowRoot.appendChild(canvas);

    const context = canvas.getContext("2d");

    if (context === null) throw new Error("Null context");

    this.#context = context;

    this.#mouseTracker = new MouseTracker(this.domCanvas);

    this.#clickTracker = new ClickTracker(this.domCanvas);
  }

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    switch (type) {
      case "keydown":
      case "keyup":
        window.addEventListener(type, listener, options);
        break;
      default:
        super.addEventListener(type, listener, options);
    }
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

  get center() {
    return Vector2D.xy(this.width / 2, this.height / 2);
  }

  connectedCallback() {
    this.domCanvas.style.scale = `${1 / devicePixelRatio}`;

    document.addEventListener("DOMContentLoaded", this.queueRender.bind(this));

    this.addEventListener("change", this.queueRender.bind(this));
  }

  get keyDown() {
    return this.#keyboardTracker.down;
  }

  get domCanvas() {
    return this.#context.canvas;
  }

  get clicked() {
    return this.#clickTracker.clicked;
  }

  get clickPosition() {
    return this.#clickTracker;
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

    this.queueRender();
  }

  get frame() {
    return this.#frame;
  }

  keyHeld(...args: Parameters<KeyboardTracker["keyHeld"]>) {
    return this.#keyboardTracker.keyHeld(...args);
  }

  keyPreviouslyHeld(...args: Parameters<KeyboardTracker["keyPreviouslyHeld"]>) {
    return this.#keyboardTracker.keyPreviouslyHeld(...args);
  }

  get lastKey() {
    return this.#keyboardTracker.last;
  }

  get mouse() {
    return this.#mouseTracker;
  }

  queueRender() {
    if (this.#renderQueued || this.#waitFor.size) return;

    this.#renderQueued = true;

    requestAnimationFrame(this.render.bind(this));
  }

  get width() {
    return this.domCanvas.width / devicePixelRatio;
  }

  set width(value) {
    this.domCanvas.width = value * devicePixelRatio;
  }

  get height() {
    return this.domCanvas.width / devicePixelRatio;
  }

  set height(value) {
    this.domCanvas.height = value * devicePixelRatio;
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

    context.beginPath();

    for (const child of this.children) {
      if (child instanceof Canvas2DBaseRenderable) {
        child.render(this);
      }
    }

    context.restore();

    this.#renderQueued = false;

    this.#clickTracker.advanceFrame();

    this.#mouseTracker.advanceFrame();

    if (this.#animating) this.queueRender();
  }

  renderOn(eventName: keyof HTMLElementEventMap) {
    if (this.#renderEvents.has(eventName)) return;

    this.domCanvas.addEventListener(eventName, this.queueRender.bind(this));

    this.#renderEvents.add(eventName);
  }

  waitFor(element: Element, eventName: keyof HTMLElementEventMap = "load") {
    this.#waitFor.add(element);

    element.addEventListener(eventName, () => {
      this.#waitFor.delete(element);

      if (this.#waitFor.size === 0) this.queueRender();
    });
  }
}

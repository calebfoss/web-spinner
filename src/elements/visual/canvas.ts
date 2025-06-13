import { Vector2D } from "../../classes/vector2d";
import { ClickTracker } from "../../classes/click";
import { KeyboardTracker } from "../../classes/keyboard";
import { MouseTracker } from "../../classes/mouse";
import { c2dStandaloneChildren } from "../../mixins/children";
import { attributeParser } from "../../utlities/attributeParser";
import { C2DBase } from "./c2dBase";
import { Canvas2DBaseRenderable } from "./renderable";
import { DrawStyle } from "../../classes/gradient";

export class Canvas2DCanvasElement extends c2dStandaloneChildren(C2DBase) {
  static observedAttributes: string[] = [
    ...C2DBase.observedAttributes,
    "alpha",
    "width",
    "height",
    "background",
  ];
  static get tag() {
    return "c2d-canvas";
  }

  #animating = false;
  #background: DrawStyle = "none";
  #clickTracker: ClickTracker;
  #context: CanvasRenderingContext2D;
  #deltaTime: number = 0;
  #devicePixelRatio: number;
  #frame = 0;
  #keyboardTracker = new KeyboardTracker();
  #lastFrameTime = -1;
  #mouseTracker: MouseTracker;
  #renderEvents = new Set<keyof HTMLElementEventMap>();
  #renderQueued = false;
  #setAlpha: number | null = null;
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

    this.#devicePixelRatio = window.devicePixelRatio;
  }

  /**
   * @private
   */
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

  /**
   * Transparency applied to all shapes and images on this canvas. 0.0 is fully
   * transparent, and 1.0 is fully opaque. This does not apply to the background.
   */
  get alpha(): number {
    /* 
    The rendering context's globalAlpha property does not retain values set  
    before the canvas is connected, so the private property is here to allow the 
    property to be set when creating the canvas.
    */
    return this.#setAlpha ?? this.context.globalAlpha;
  }

  set alpha(value) {
    this.registerChange(
      "alpha",
      (this.context.globalAlpha = this.#setAlpha = value)
    );
  }

  /**
   * True if the canvas is rendering animation.
   */
  get animating(): boolean {
    return this.#animating;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (newValue !== null) {
      switch (name) {
        case "alpha":
          this.alpha = attributeParser.number(newValue);
          break;

        case "width":
          this.width = attributeParser.number(newValue);
          break;

        case "height":
          this.height = attributeParser.number(newValue);
          break;

        case "background":
          this.background = attributeParser.Color(newValue);
          break;
      }
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /**
   * At the beginning of each frame, the canvas renders its background using
   * this style. It may be a Color or Gradient. When set to "none", the canvas
   * will not render a background. This will result in the next frame being
   * rendered on top of the last frame's contents.
   *
   * @attr
   * @reflect
   */
  get background(): DrawStyle {
    return this.#background;
  }

  set background(value) {
    if (this.#background.toString() === value.toString()) return;

    this.registerChange("background", (this.#background = value));
  }

  /**
   * Center point of the canvas.
   */
  get center(): Vector2D {
    return Vector2D.xy(this.width / 2, this.height / 2);
  }

  connectedCallback() {
    const pixelRatioQuery = `(resolution: ${window.devicePixelRatio}dppx)`;

    const media = window.matchMedia(pixelRatioQuery);

    media.addEventListener("change", this.#updateScale.bind(this));

    this.#updateScale();

    document.addEventListener("DOMContentLoaded", this.queueRender.bind(this));

    this.addEventListener("change", this.queueRender.bind(this));

    /* 
    The rendering context's globalAlpha property does not retain values set  
    before the canvas is connected, so this is here to allow the property to be
    set when creating the canvas.
    */
    this.alpha = this.alpha;
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

  /**
   * Time passed the previous and current frame.
   */
  get deltaTime() {
    return this.#deltaTime;
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

    requestAnimationFrame((time) => {
      this.#deltaTime = time - this.#lastFrameTime;

      this.#lastFrameTime = time;

      this.#render();
    });
  }

  /**
   * The width of the canvas element in pixels divided by the device's pixel ratio.
   *
   * @attr
   * @reflect
   */
  get width(): number {
    return this.domCanvas.width / devicePixelRatio;
  }

  set width(value) {
    const { devicePixelRatio } = window;

    if (value === this.domCanvas.width / devicePixelRatio) return;

    this.domCanvas.width = value * devicePixelRatio;

    this.registerChange("width", value);
  }

  /**
   * The height of the canvas element in pixels divided by the device's pixel ratio.
   *
   * @attr
   * @reflect
   */
  get height(): number {
    return this.domCanvas.height / devicePixelRatio;
  }

  set height(value) {
    const { devicePixelRatio } = window;

    if (value === this.domCanvas.height / devicePixelRatio) return;

    this.domCanvas.height = value * devicePixelRatio;

    this.registerChange("height", value);
  }

  #render() {
    if (this.#waitFor.size) return;

    this.#frame++;

    const context = this.#context;

    context.save();

    this.everyFrame?.(this.#frame);

    this.#renderQueued = false;

    context.scale(devicePixelRatio, devicePixelRatio);

    if (this.#background !== "none") {
      context.save();

      context.globalAlpha = 1;

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

    this.#clickTracker.advanceFrame();

    this.#keyboardTracker.advanceFrame();

    this.#mouseTracker.advanceFrame();

    if (this.#animating) this.queueRender();
  }

  renderOn(eventName: keyof HTMLElementEventMap) {
    if (this.#renderEvents.has(eventName)) return;

    this.domCanvas.addEventListener(eventName, this.queueRender.bind(this));

    this.#renderEvents.add(eventName);
  }

  #updateScale() {
    const { devicePixelRatio: newPixelRatio } = window;

    const scaleRatio = newPixelRatio / this.#devicePixelRatio;

    this.domCanvas.width *= scaleRatio;
    this.domCanvas.height *= scaleRatio;

    this.domCanvas.style.scale = `${1 / newPixelRatio}`;

    this.#devicePixelRatio = newPixelRatio;
  }

  waitFor(element: Element, eventName: keyof HTMLElementEventMap = "load") {
    this.#waitFor.add(element);

    element.addEventListener(eventName, () => {
      this.#waitFor.delete(element);

      if (this.#waitFor.size === 0) this.queueRender();
    });
  }
}

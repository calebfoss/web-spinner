import { ClickData } from "../../classes/click";
import { MouseTracker, MouseData } from "../../classes/mouse";
import { partChildren, standaloneChildren } from "../../mixins/children";
import { Canvas2DCanvasElement } from "./canvas";
import { Canvas2DElement } from "./element";
import { Canvas2DShape } from "./shape";

export const changedEvent = new Event("change", { bubbles: true });

const camelToKebabCase = (camel: string) =>
  camel.replace(
    /(.)([A-Z])/g,
    (_, beforeCharacter: string, upperCharacter: string) =>
      `${beforeCharacter}-${upperCharacter.toLowerCase()}`
  );

export class Canvas2DBaseRenderable extends Canvas2DElement {
  #changedSinceRender = false;
  #clickListeners = new Set<EventListenerOrEventListenerObject>();
  #localMouse = new MouseData();
  #mouseListeners = new Set<EventListenerOrEventListenerObject>();

  constructor(...args: any[]) {
    super();
  }

  addEventListener(
    type: keyof HTMLElementEventMap,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    switch (type) {
      case "click":
        this.canvas.renderOn(type);
        this.#clickListeners.add(listener);
        break;

      case "mousedown":
      case "mouseup":
      case "mousemove":
        this.canvas.renderOn(type);
        this.#mouseListeners.add(listener);
        break;

      case "mouseenter":
      case "mouseout":
      case "mouseover":
        this.canvas.renderOn("mousemove");
        this.#mouseListeners.add(listener);
        break;
    }

    super.addEventListener(type, listener, options);
  }

  removeEventListener(
    type: keyof HTMLElementEventMap,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    switch (type) {
      case "click":
        this.#clickListeners.delete(listener);
        break;
      case "mousedown":
      case "mouseup":
      case "mouseenter":
      case "mouseout":
      case "mouseover":
      case "mousemove":
        this.#mouseListeners.delete(listener);
        break;
    }

    super.removeEventListener(type, listener, options);
  }

  get changedSinceRender() {
    return this.#changedSinceRender;
  }

  #handleClick(canvas2D: Canvas2DCanvasElement) {
    const { context, clickPosition } = canvas2D;

    const inPath = context.isPointInPath(clickPosition.x, clickPosition.y);

    if (inPath) this.dispatchEvent(new PointerEvent("click"));
  }

  #handleMouse(canvas2D: Canvas2DCanvasElement) {
    const { context, mouse } = canvas2D;

    const inPath = context.isPointInPath(mouse.x, mouse.y);

    if (!inPath) {
      if (this.#localMouse.over === true) {
        this.dispatchEvent(new MouseEvent("mouseout"));

        this.#localMouse.over = false;
      }

      return;
    }

    this.dispatchEvent(new MouseEvent("mouseover"));

    if (!this.#localMouse.equals(mouse))
      this.dispatchEvent(new MouseEvent("mousemove"));

    if (!this.#localMouse.over) {
      this.dispatchEvent(new MouseEvent("mouseenter"));

      this.#localMouse.over = true;
    }

    for (const [index, buttonState] of mouse.buttonStates.entries()) {
      if (buttonState !== this.#localMouse.buttonStates[index]) {
        if (buttonState)
          this.dispatchEvent(new MouseEvent("mousedown", { button: index }));
        else this.dispatchEvent(new MouseEvent("mouseup", { button: index }));

        this.#localMouse.buttonStates[index] = buttonState;
      }
    }
  }

  registerChange<P extends keyof this, V extends this[P]>(
    propertyName: P,
    newValue: V
  ) {
    if (!this.#changedSinceRender) {
      this.#changedSinceRender = true;
      this.dispatchEvent(changedEvent);
    }

    const attributeName = camelToKebabCase(propertyName as string);

    this.setAttribute(attributeName, newValue as string);
  }

  render(canvas2D: Canvas2DCanvasElement) {
    const { context, frame } = canvas2D;

    context.save();

    this.everyFrame?.(frame);
  }

  renderChildren(canvas2D: Canvas2DCanvasElement) {
    for (const child of this.children) {
      if (child instanceof Canvas2DBaseRenderable) child.render(canvas2D);
    }
  }

  afterRender(canvas2D: Canvas2DCanvasElement) {
    this.#changedSinceRender = false;

    if (this.#clickListeners.size) this.#handleClick(canvas2D);

    if (this.#mouseListeners.size) this.#handleMouse(canvas2D);

    this.renderChildren(canvas2D);

    canvas2D.context.restore();
  }
}

export class Canvas2DStandaloneRenderable extends standaloneChildren(
  Canvas2DBaseRenderable
) {
  render(canvas2D: Canvas2DCanvasElement) {
    super.render(canvas2D);

    canvas2D.context.beginPath();
  }
}

export class Canvas2DShapePartRenderable extends partChildren(
  Canvas2DBaseRenderable
) {}

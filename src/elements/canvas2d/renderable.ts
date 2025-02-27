import { ClickData } from "../../classes/click";
import {
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "../../classes/gradient";
import { MouseTracker, MouseData } from "../../classes/mouse";
import { Shadow } from "../../classes/shadow";
import { Vector2D } from "../../classes/vector2d";
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
  #shadow: Shadow | null = null;

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

  renderConicalGradient(
    context: CanvasRenderingContext2D,
    gradient: ConicalGradient
  ) {
    return gradient.render(context, this.canvas.center);
  }

  renderLinearGradient(
    context: CanvasRenderingContext2D,
    gradient: LinearGradient
  ) {
    const { width, height } = this.canvas;
    return gradient.render(context, 0, 0, width, height);
  }

  renderRadialGradient(
    context: CanvasRenderingContext2D,
    gradient: RadialGradient
  ) {
    const { center, width, height } = this.canvas;
    const canvasRadius = Math.max(width, height) / 2;

    return gradient.render(context, center.x, center.y, canvasRadius);
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
    const { context, clickPosition: canvasClick, clicked } = canvas2D;

    if (!clicked) return;

    const elementClick = this.scaleByPixelRatio(canvasClick);

    const inPath = context.isPointInPath(elementClick.x, elementClick.y);

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

    const currentAttributeValue = this.getAttribute(attributeName);

    const stringValue = String(newValue);

    if(currentAttributeValue === stringValue) return;

    this.setAttribute(attributeName, stringValue);
  }

  render(canvas2D: Canvas2DCanvasElement) {
    const { context, frame } = canvas2D;

    context.save();

    this.everyFrame?.(frame);

    if (this.#shadow !== null) {
      this.#shadow.render(context);
    }
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

  #shadowChangeListener: ChangeListener<Shadow> = (newValue) => {
    this.registerChange("shadow", (this.#shadow = newValue));
  };

  get shadow() {
    return this.#shadow;
  }

  set shadow(value) {
    if (this.#shadow === null) {
      if (value === null) return;

      value.addChangeListener(this.#shadowChangeListener);

      this.#shadowChangeListener(value);
      return;
    } else if (value === null) {
      this.#shadow.removeChangeListener(this.#shadowChangeListener);

      this.registerChange("shadow", value);

      return;
    }

    this.#shadow.removeChangeListener(this.#shadowChangeListener);

    value.addChangeListener(this.#shadowChangeListener);

    if (!this.#shadow.equals(value)) this.#shadowChangeListener(value);
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

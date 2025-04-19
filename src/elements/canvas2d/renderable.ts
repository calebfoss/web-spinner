import {
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "../../classes/gradient";
import { MouseData } from "../../classes/mouse";
import { Shadow } from "../../classes/shadow";
import { Vector2D } from "../../classes/vector2d";
import { c2dShapeChildren, c2dStandaloneChildren } from "../../mixins/children";
import { Canvas2DCanvasElement } from "./canvas";
import { Canvas2DElement } from "./element";
import { Canvas2DShape } from "./shape";

export const changedEvent = new Event("change", { bubbles: true });

export class Canvas2DBaseRenderable extends Canvas2DElement {
  #changedSinceRender = false;
  #clickListeners = new Set<EventListenerOrEventListenerObject>();
  #localMouse = new MouseData();
  #mouseListeners = new Set<EventListenerOrEventListenerObject>();
  #shadow: Shadow | null = null;

  constructor(...args: any[]) {
    super();
  }

  /**
   * @private
   */
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

  /**
   * @private
   */
  renderConicalGradient(
    context: CanvasRenderingContext2D,
    gradient: ConicalGradient
  ) {
    return gradient.render(context, this.canvas.center);
  }

  /**
   * @private
   */
  renderLinearGradient(
    context: CanvasRenderingContext2D,
    gradient: LinearGradient
  ) {
    const { width, height } = this.canvas;
    return gradient.render(context, 0, 0, width, height);
  }

  /**
   * @private
   */
  renderRadialGradient(
    context: CanvasRenderingContext2D,
    gradient: RadialGradient
  ) {
    const { center, width, height } = this.canvas;
    const canvasRadius = Math.max(width, height) / 2;

    return gradient.render(context, center.x, center.y, canvasRadius);
  }

  /**
   * @private
   */
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

  /**
   * @private
   */
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

  /**
   * @private
   */
  registerChange<P extends keyof Writeable<this>>(
    propertyName: P,
    newValue: this[P]
  ) {
    if (!this.#changedSinceRender) {
      this.#changedSinceRender = true;
      this.dispatchEvent(changedEvent);
    }

    super.registerChange(propertyName, newValue);
  }

  /**
   * @private
   */
  render(canvas2D: Canvas2DCanvasElement) {
    const { context, frame } = canvas2D;

    context.save();

    this.everyFrame?.(frame);

    if (this.#shadow !== null) {
      this.#shadow.render(context);
    }
  }

  /**
   * @private
   */
  renderChildren(canvas2D: Canvas2DCanvasElement) {
    for (const child of this.children) {
      if (child instanceof Canvas2DBaseRenderable) child.render(canvas2D);
    }
  }

  /**
   * @private
   */

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

  /**
   * Drop shadow rendered behind the element.
   */
  get shadow(): Shadow | null {
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

export class Canvas2DStandaloneRenderable extends c2dStandaloneChildren(
  Canvas2DBaseRenderable
) {
  render(canvas2D: Canvas2DCanvasElement) {
    super.render(canvas2D);

    canvas2D.context.beginPath();
  }
}

export class Canvas2DShapePartRenderable extends c2dShapeChildren(
  Canvas2DBaseRenderable
) {}

import { ClickData } from "../../classes/click";
import { MouseTracker, MouseData } from "../../classes/mouse";
import { partChildren, standaloneChildren } from "../../mixins/children";
import { Canvas2DCanvasElement } from "./canvas";
import { Canvas2DElement } from "./element";
import { Canvas2DShape } from "./shape";

const changedEvent = new Event("change", { bubbles: true });

const camelToKebabCase = (camel: string) =>
  camel.replace(
    /(.)([A-Z])/g,
    (_, beforeCharacter: string, upperCharacter: string) =>
      `${beforeCharacter}-${upperCharacter.toLowerCase()}`
  );

export class Canvas2DBaseRenderable extends Canvas2DElement {
  #changedSinceRender = false;
  #localClick = new ClickData();
  #localMouse = new MouseData();

  constructor(...args: any[]) {
    super();
  }

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    this.canvas.domCanvas.addEventListener(
      type,
      this.canvas.render.bind(this.canvas)
    );

    super.addEventListener(type, listener, options);
  }

  get changedSinceRender() {
    return this.#changedSinceRender;
  }

  get clicked() {
    return this.#localClick.clicked;
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

    const { context, clicked, mouse } = canvas2D;

    this.#localClick.clicked =
      clicked && context.isPointInPath(mouse.x, mouse.y);

    if (this.#localClick.clicked) this.dispatchEvent(new MouseEvent("click"));

    this.renderChildren(canvas2D);

    canvas2D.context.restore();

    this.#localClick.clicked = false;
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

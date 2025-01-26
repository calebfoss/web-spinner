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

  constructor(...args: any[]) {
    super();
  }

  get changedSinceRender() {
    return this.#changedSinceRender;
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

  render(context: CanvasRenderingContext2D, frame: number) {
    context.save();

    this.everyFrame?.(frame);
  }

  renderChildren(context: CanvasRenderingContext2D, frame: number) {
    for (const child of this.children) {
      if (child instanceof Canvas2DBaseRenderable) child.render(context, frame);
    }
  }

  afterRender(context: CanvasRenderingContext2D, frame: number) {
    this.#changedSinceRender = false;

    this.renderChildren(context, frame);

    context.restore();
  }
}

export class Canvas2DStandaloneRenderable extends standaloneChildren(
  Canvas2DBaseRenderable
) {
  render(context: CanvasRenderingContext2D, frame: number) {
    super.render(context, frame);

    context.beginPath();
  }
}

export class Canvas2DShapePartRenderable extends partChildren(
  Canvas2DBaseRenderable
) {}

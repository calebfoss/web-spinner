import { Canvas2DElement } from "./element";

const changedEvent = new Event("change", { bubbles: true });

const camelToKebabCase = (camel: string) =>
  camel.replace(
    /(.)([A-Z])/g,
    (_, beforeCharacter: string, upperCharacter: string) =>
      `${beforeCharacter}-${upperCharacter.toLowerCase()}`
  );

export class Canvas2DRenderable extends Canvas2DElement {
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

    context.beginPath();

    this.everyFrame?.(frame);
  }

  afterRender(context: CanvasRenderingContext2D, frame: number) {
    this.#changedSinceRender = false;

    for (const child of this.children) {
      if (child instanceof Canvas2DRenderable) child.render(context, frame);
    }

    context.restore();
  }
}

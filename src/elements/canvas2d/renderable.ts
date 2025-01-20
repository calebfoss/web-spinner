import { Canvas2DElement } from "./element";

export class Canvas2DRenderable extends Canvas2DElement {
  constructor(...args: any[]) {
    super();
  }

  render(context: CanvasRenderingContext2D, frame: number) {
    context.save();
    context.beginPath();
    this.everyFrame?.(frame);
  }

  afterRender(context: CanvasRenderingContext2D, frame: number) {
    for (const child of this.children) {
      if (child instanceof Canvas2DRenderable) child.render(context, frame);
    }

    context.restore();
  }
}

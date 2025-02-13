import { Canvas2DElement } from "../elements/canvas2d/element";
import { Color } from "./color";

class ColorStop {
  #offset: number;
  #color: Color;

  constructor(offset: number, color: Color) {
    this.#offset = offset;
    this.#color = color;
  }

  get offset() {
    return this.#offset;
  }

  get color() {
    return this.#color;
  }
}

export class Gradient {
  #stops: ColorStop[] = [];

  addColorStop(offset: number, color: Color) {
    this.#stops.push(new ColorStop(offset, color));
  }

  protected applyStops(gradient: CanvasGradient) {
    for (const stop of this.#stops) {
      gradient.addColorStop(stop.offset, stop.color.toString());
    }
  }

  render(context: CanvasRenderingContext2D, ...args: any[]): CanvasGradient {
    throw new Error("Render called on base Gradient class");
  }

  get stops() {
    return this.#stops;
  }

  toString() {
    return "gradient";
  }
}

export class LinearGradient extends Gradient {
  #colorStartX: number;
  #colorStartY: number;
  #colorEndX: number;
  #colorEndY: number;

  constructor(startX = 0, startY = 0, endX = 1, endY = 1) {
    super();

    this.#colorStartX = startX;
    this.#colorStartY = startY;
    this.#colorEndX = endX;
    this.#colorEndY = endY;
  }

  render(
    context: CanvasRenderingContext2D,
    boundsX: number,
    boundsY: number,
    boundsWidth: number,
    boundsHeight: number
  ) {
    const x0 = boundsX + boundsWidth * this.#colorStartX;
    const y0 = boundsY + boundsHeight * this.#colorStartY;
    const x1 = boundsX + boundsWidth * this.#colorEndX;
    const y1 = boundsY + boundsHeight * this.#colorEndY;

    const gradient = context.createLinearGradient(x0, y0, x1, y1);

    this.applyStops(gradient);

    return gradient;
  }
}

export class RadialGradient extends Gradient {
  #startX: number;
  #startY: number;
  #startRadius: number;
  #endX: number;
  #endY: number;
  #endRadius: number;

  constructor(
    startX = 0,
    startY = 0,
    startRadius = 0,
    endX = 0,
    endY = 0,
    endRadius = 1
  ) {
    super();

    this.#startX = startX;
    this.#startY = startY;
    this.#startRadius = startRadius;
    this.#endX = endX;
    this.#endY = endY;
    this.#endRadius = endRadius;
  }

  render(
    context: CanvasRenderingContext2D,
    boundsX: number,
    boundsY: number,
    boundsRadius: number
  ): CanvasGradient {
    const x0 = boundsX + this.#startX * boundsRadius;
    const y0 = boundsY + this.#startY * boundsRadius;
    const r0 = boundsRadius * this.#startRadius;

    const x1 = boundsX + this.#endX * boundsRadius;
    const y1 = boundsY + this.#endY * boundsRadius;
    const r1 = boundsRadius * this.#endRadius;

    const gradient = context.createRadialGradient(x0, y0, r0, x1, y1, r1);

    this.applyStops(gradient);

    return gradient;
  }
}

export type DrawStyle = Color | string | CanvasGradient | None;

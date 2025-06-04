import { C2DBase } from "../elements/visual/c2dBase";
import { Angle } from "./angle";
import { Color } from "./color";
import { Vector2D } from "./vector2d";

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

    return this;
  }

  protected applyStops(gradient: CanvasGradient) {
    for (const stop of this.#stops) {
      gradient.addColorStop(stop.offset, stop.color.toString());
    }
  }

  protected defineSVGStops(definition: SVGGradientElement) {
    const { stops } = this;

    for (const stop of stops) {
      const stopElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );

      stopElement.setAttribute("offset", stop.offset.toString());

      stopElement.setAttribute("stop-color", stop.color.toString());

      definition.appendChild(stopElement);
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

  get svg(): SVGGradientElement {
    throw new Error("This type of gradient is not yet supported for SVG.");
  }
}

export class LinearGradient extends Gradient {
  #colorStartX: number;
  #colorStartY: number;
  #colorEndX: number;
  #colorEndY: number;
  #svg: SVGLinearGradientElement | null = null;

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

  get svg() {
    if (this.#svg !== null) return this.#svg;

    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );

    svgElement.setAttribute("x1", this.#colorStartX.toString());

    svgElement.setAttribute("y1", this.#colorStartY.toString());

    svgElement.setAttribute("x2", this.#colorEndX.toString());

    svgElement.setAttribute("y2", this.#colorEndY.toString());

    this.defineSVGStops(svgElement);

    return (this.#svg = svgElement);
  }
}

export class RadialGradient extends Gradient {
  #startX: number;
  #startY: number;
  #startRadius: number;
  #endX: number;
  #endY: number;
  #endRadius: number;
  #svg: SVGRadialGradientElement | null = null;

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

  get svg() {
    if (this.#svg !== null) return this.#svg;

    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "radialGradient"
    );

    svgElement.setAttribute("fr", this.#startRadius.toString());

    svgElement.setAttribute("fx", this.#startX.toString());

    svgElement.setAttribute("cx", this.#endX.toString());

    svgElement.setAttribute("cy", this.#endY.toString());

    svgElement.setAttribute("r", this.#endRadius.toString());

    this.defineSVGStops(svgElement);

    return (this.#svg = svgElement);
  }
}

export class ConicalGradient extends Gradient {
  #startAngle: Angle;
  #offset: Vector2D;

  constructor(
    startAngle: Angle = Angle.zero,
    offset: Vector2D = Vector2D.zero
  ) {
    super();

    this.#startAngle = startAngle;
    this.#offset = offset;
  }

  render(context: CanvasRenderingContext2D, center: Vector2D): CanvasGradient {
    const x = center.x + this.#offset.x;
    const y = center.y + this.#offset.y;

    const gradient = context.createConicGradient(
      this.#startAngle.radians,
      x,
      y
    );

    this.applyStops(gradient);

    return gradient;
  }
}

export type DrawStyle = Color | string | CanvasGradient | None;

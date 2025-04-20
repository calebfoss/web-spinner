import { ConicalGradient, LinearGradient } from "../classes/gradient";
import { Vector2D } from "../classes/vector2d";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { CustomHTMLElement } from "../elements/mixable";
import { SVGElementController } from "../elements/svg/base";
import { dimensions, extendSVGDimensions } from "./dimensions";
import { extendSVGOffset, offset } from "./offset";

type Origin = "center" | "topLeft";

function baseRectangleBounds<B extends typeof CustomHTMLElement>(Base: B) {
  return class extends dimensions(offset(Base)) {
    #origin: Origin = "topLeft";

    get topLeft() {
      switch (this.#origin) {
        case "topLeft":
          return this.offset;
        case "center":
          return this.offset.minus(this.width / 2, this.height / 2);
      }
      return this.offset;
    }

    get topRight() {
      return this.topLeft.plus(this.width, 0);
    }

    get center() {
      switch (this.#origin) {
        case "topLeft":
          return this.offset.plus(this.width / 2, this.height / 2);
        case "center":
          return this.offset;
      }
    }

    get bottomLeft() {
      return this.topLeft.plus(0, this.height);
    }

    get bottomRight() {
      return this.topRight.plus(0, this.height);
    }

    get origin() {
      return this.#origin;
    }

    set origin(value) {
      this.#origin = value;
    }
  };
}

export function c2dRectangleBounds<B extends typeof Canvas2DBaseRenderable>(
  Base: B
) {
  return class extends baseRectangleBounds(Base) {
    renderConicalGradient(
      context: CanvasRenderingContext2D,
      gradient: ConicalGradient
    ): CanvasGradient {
      return gradient.render(context, this.center);
    }

    renderLinearGradient(
      context: CanvasRenderingContext2D,
      gradient: LinearGradient
    ): CanvasGradient {
      const { x: x0, y: y0 } = this.topLeft;

      const { x: x1, y: y1 } = this.bottomRight;

      return gradient.render(context, x0, y0, x1 - x0, y1 - y0);
    }
  };
}

export function svgRectangleBounds<B extends SVGElementController>(Base: B) {
  return class extends extendSVGOffset(
    extendSVGDimensions(baseRectangleBounds(Base))
  ) {};
}

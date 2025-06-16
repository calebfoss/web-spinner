import { ConicalGradient, LinearGradient } from "../classes/gradient";
import { Vector2D } from "../classes/vector2d";
import { Canvas2DBaseRenderable } from "../elements/visual/renderable";
import { CustomHTMLElement } from "../elements/mixable";
import { SVGElementController } from "../elements/visual/svgBase";
import { dimensions, extendSVGDimensions } from "./dimensions";
import { extendSVGOffset, offset } from "./offset";

type Origin = "center" | "topLeft";

function baseRectangleBounds<B extends typeof CustomHTMLElement>(Base: B) {
  return class extends dimensions(offset(Base)) {
    static observedAttributes = [
      ...dimensions(offset(Base)).observedAttributes,
      "origin",
    ];

    #origin: Origin = "topLeft";

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (name === "origin") {
        if (newValue === null) return;

        this.origin = newValue as Origin;
      }

      return super.attributeChangedCallback(name, oldValue, newValue);
    }

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
      if (this.#origin === value) return;

      this.registerChange("origin", (this.#origin = value));
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
  ) {
    _updateOffset() {
      const { x, y } = this.topLeft;
      this.mainElement.setAttribute("x", x.toString());
      this.mainElement.setAttribute("y", y.toString());
    }

    get origin() {
      return super.origin;
    }

    set origin(value) {
      super.origin = value;

      this._updateOffset();
    }
  };
}

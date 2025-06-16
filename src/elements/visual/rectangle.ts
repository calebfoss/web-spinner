import { BorderRadius } from "../../classes/borderRadius";
import {
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "../../classes/gradient";
import { svgChildren } from "../../mixins/children";
import { svgDimensions } from "../../mixins/dimensions";
import { c2dFill, svgFill } from "../../mixins/fill";
import {
  c2dRectangleBounds,
  svgRectangleBounds,
} from "../../mixins/rectangleBounds";
import { c2dStroke, svgStroke } from "../../mixins/stroke";
import {
  C2DShapePartTransformed,
  C2DStandaloneTransformed,
  C2DTransformed,
  svgTransform,
} from "../../mixins/transform";
import { attributeParser } from "../../utlities/attributeParser";
import { Canvas2DCanvasElement } from "./canvas";
import { createSVGController } from "./svgBase";

function renderCanvasRectangle<B extends C2DTransformed>(Base: B) {
  return class Rectangle extends c2dRectangleBounds(Base) {
    static observedAttributes = [
      ...c2dRectangleBounds(Base).observedAttributes,
      "border-radius",
    ];

    #borderRadius: BorderRadius | null = null;

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (name === "border-radius") {
        if (newValue === null) this.borderRadius = null;
        else if (newValue === this.borderRadius?.toString()) return;
        else this.borderRadius = attributeParser.BorderRadius(newValue);
        return;
      }

      super.attributeChangedCallback(name, oldValue, newValue);
    }

    #borderRadiusChangeListener = () => {
      this.registerChange("borderRadius", this.#borderRadius);
    };
    /**
     *
     */
    get borderRadius(): BorderRadius | null {
      return this.#borderRadius;
    }

    set borderRadius(value: BorderRadius | number | null) {
      const currentBorderRadius = this.borderRadius;

      if (value === currentBorderRadius) return;
      if (value === null) {
        if (currentBorderRadius === null) return;
        currentBorderRadius.removeChangeListener(
          this.#borderRadiusChangeListener
        );

        this.registerChange("borderRadius", (this.#borderRadius = value));

        return;
      }
      const newBorderRadius =
        typeof value === "number" ? new BorderRadius(value) : value;

      if (currentBorderRadius === null) {
        newBorderRadius.addChangeListener(this.#borderRadiusChangeListener);

        this.registerChange(
          "borderRadius",
          (this.#borderRadius = newBorderRadius)
        );

        return;
      }

      this.#borderRadius = newBorderRadius;

      currentBorderRadius.replace(
        newBorderRadius,
        this.#borderRadiusChangeListener
      );
    }

    render(canvas2D: Canvas2DCanvasElement): void {
      super.render(canvas2D);

      const {
        topLeft: { x, y },
        width,
        height,
      } = this;

      if (this.borderRadius === null)
        canvas2D.context.rect(x, y, width, height);
      else
        canvas2D.context.roundRect(
          x,
          y,
          width,
          height,
          this.borderRadius.toArray()
        );

      this.afterRender(canvas2D);
    }

    renderRadialGradient(
      context: CanvasRenderingContext2D,
      gradient: RadialGradient
    ): CanvasGradient {
      const radius = Math.max(this.width, this.height) / 2;

      const { x, y } = this.center;

      return gradient.render(context, x, y, radius);
    }
  };
}

export class Canvas2DRectangle extends renderCanvasRectangle(
  c2dStroke(c2dFill(C2DStandaloneTransformed))
) {
  static get tag() {
    return "c2d-rectangle";
  }
}

customElements.define("c2d-rectangle", Canvas2DRectangle);

export class Canvas2DShapeRectangle extends renderCanvasRectangle(
  C2DShapePartTransformed
) {
  static get tag() {
    return "c2d-shape-rectangle";
  }
}

customElements.define("c2d-shape-rectangle", Canvas2DShapeRectangle);

export class SVGRectangleController extends svgStroke(
  svgFill(
    svgDimensions(
      svgTransform(
        svgRectangleBounds(
          svgChildren(createSVGController("rect", "svg-rectangle"))
        )
      )
    )
  )
) {
  get origin() {
    return super.origin;
  }

  set origin(value) {
    super.origin = value;
  }
}

customElements.define("svg-rectangle", SVGRectangleController);

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
import { c2dTransform, svgTransform } from "../../mixins/transform";
import { attributeParser } from "../../utlities/attributeParser";
import { Canvas2DCanvasElement } from "./canvas";
import {
  Canvas2DBaseRenderable,
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "./renderable";
import { createSVGController } from "./svgBase";

function renderCanvasRectangle<B extends typeof Canvas2DBaseRenderable>(
  Base: B
) {
  return class extends c2dTransform(c2dRectangleBounds(Base)) {
    static observedAttributes = [...Base.observedAttributes, "border-radius"];

    #borderRadius: BorderRadius | null = null;

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (name === "border-radius") {
        if (newValue === null) this.borderRadius = null;
        else this.borderRadius = attributeParser.BorderRadius(newValue);
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
  c2dStroke(c2dFill(Canvas2DStandaloneRenderable))
) {
  static get tag() {
    return "c2d-rectangle";
  }
}

customElements.define("c2d-rectangle", Canvas2DRectangle);

export class Canvas2DShapeRectangle extends renderCanvasRectangle(
  Canvas2DShapePartRenderable
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

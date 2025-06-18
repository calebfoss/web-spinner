import { Color } from "../classes/color";
import {
  ConicalGradient,
  DrawStyle,
  Gradient,
  LinearGradient,
  RadialGradient,
} from "../classes/gradient";
import { Canvas2DCanvasElement } from "../elements/visual/canvas";
import { Canvas2DBaseRenderable } from "../elements/visual/renderable";
import { CustomHTMLElement } from "../elements/mixable";
import { SVGElementController } from "../elements/visual/svgBase";
import { attributeParser } from "../utlities/attributeParser";

function baseFill<B extends typeof CustomHTMLElement>(Base: B) {
  return class Fillable extends Base {
    static observedAttributes: string[] = [...Base.observedAttributes, "fill"];

    #fill: DrawStyle | null = null;

    /**
     * The rendering style inside the element. This may be a color or gradient.
     * When set to null, the parent element's style is used. When
     * set to "none", the inside will be transparent.
     *
     * @attr
     * @reflect
     */
    get fill(): DrawStyle | null {
      return this.#fill;
    }

    set fill(value) {
      if (this.#fill === value) return;

      if (
        this.#fill instanceof Color &&
        value instanceof Color &&
        this.#fill.equals(value)
      )
        return;

      if (typeof value === "string")
        this.registerChange(
          "fill",
          (this.#fill = value === "none" ? value : Color.fromString(value))
        );
      else this.registerChange("fill", (this.#fill = value));
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      if (name === "fill") {
        if (newValue === null) this.fill = null;
        else {
          const fillValue = attributeParser.FillStrokeStyle(newValue);

          if (fillValue !== "gradient") this.fill = fillValue;
        }
      }

      super.attributeChangedCallback(name, oldValue, newValue);
    }
  };
}

export function c2dFill<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class Fillable extends baseFill(Base) {
    render(canvas2D: Canvas2DCanvasElement): void {
      super.render(canvas2D);

      const { context } = canvas2D;

      if (this.fill instanceof Color) context.fillStyle = this.fill.toString();
      else if (this.fill instanceof Gradient) {
        if (this.fill instanceof ConicalGradient) {
          context.fillStyle = this.renderConicalGradient(context, this.fill);
        } else if (this.fill instanceof LinearGradient) {
          context.fillStyle = this.renderLinearGradient(context, this.fill);
        } else if (this.fill instanceof RadialGradient) {
          context.fillStyle = this.renderRadialGradient(context, this.fill);
        }
      }
    }

    afterRender(canvas2D: Canvas2DCanvasElement): void {
      if (this.fill !== "none") canvas2D.context.fill();

      super.afterRender(canvas2D);
    }
  };
}

export function svgFill<B extends SVGElementController>(Base: B) {
  return class extends baseFill(Base) {
    connectedCallback(): void {
      super.connectedCallback();

      if (this.fill instanceof Gradient) this.#fillGradient(this.fill);
    }

    get fill() {
      return super.fill;
    }

    set fill(value) {
      if (super.fill?.toString() === value?.toString()) return;

      super.fill = value;

      const { fill } = this;

      if (fill === null) return;

      if (fill instanceof Color)
        this._setStyleAttribute("fill", fill.toString());
      else if (fill instanceof Gradient) this.#fillGradient(fill);
    }

    #fillGradient(gradient: Gradient) {
      const { svgContainerController } = this;

      if (svgContainerController === null) return;

      const gradientId = svgContainerController._defineGradient(gradient);

      this._setStyleAttribute("fill", `url(#${gradientId})`);
    }

    get _styleAttributes(): { [Key in keyof this]?: string } {
      return { ...super._styleAttributes, fill: "fill" };
    }
  };
}

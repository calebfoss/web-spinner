import { LinearGradient } from "../classes/gradient";
import { Color } from "../classes/color";
import {
  ConicalGradient,
  DrawStyle,
  Gradient,
  RadialGradient,
} from "../classes/gradient";
import { Canvas2DCanvasElement } from "../elements/visual/canvas";
import { Canvas2DBaseRenderable } from "../elements/visual/renderable";
import { attributeParser } from "../utlities/attributeParser";
import { SVGElementController } from "../elements/visual/svgBase";
import { CustomHTMLElement } from "../elements/mixable";

function baseStroke<B extends typeof CustomHTMLElement>(Base: B) {
  return class extends Base {
    static observedAttributes: string[] = [
      ...Base.observedAttributes,
      "stroke",
      "line-width",
    ];

    #stroke: DrawStyle | null = null;
    #lineWidth: number | null = null;

    /**
     * Width in pixels for drawing lines.
     *
     * @attr line-width
     * @reflect
     */
    get lineWidth(): number | null {
      return this.#lineWidth;
    }

    set lineWidth(value) {
      if (this.#lineWidth === value) return;

      this.registerChange("lineWidth", (this.#lineWidth = value));
    }

    /**
     * The rendering style for lines. This may be a color or gradient.
     * When set to null, the parent element's style is used. When
     * set to "none", no lines will be drawn.
     *
     * @attr
     * @reflect
     */
    get stroke(): DrawStyle | null {
      return this.#stroke;
    }

    set stroke(value) {
      if (this.#stroke === value) return;

      if (
        this.#stroke instanceof Color &&
        value instanceof Color &&
        this.#stroke.equals(value)
      )
        return;

      if (typeof value === "string")
        this.registerChange(
          "stroke",
          (this.#stroke = value === "none" ? value : Color.fromString(value))
        );
      else this.registerChange("stroke", (this.#stroke = value));
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      if (newValue !== null) {
        switch (name) {
          case "stroke": {
            {
              const strokeValue = attributeParser.FillStrokeStyle(newValue);
              if (strokeValue !== "gradient") this.stroke = strokeValue;
            }
            break;
          }

          case "line-width":
            this.lineWidth =
              newValue === null ? null : attributeParser.number(newValue);
            break;
        }

        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }
  };
}

export function c2dStroke<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class Strokeable extends baseStroke(Base) {
    render(canvas2D: Canvas2DCanvasElement): void {
      super.render(canvas2D);

      const { context } = canvas2D;

      if (this.stroke !== "none" && this.stroke !== null) {
        if (this.stroke instanceof Color)
          context.strokeStyle = this.stroke.toString();
        else if (this.stroke instanceof Gradient) {
          if (this.stroke instanceof ConicalGradient) {
            context.strokeStyle = this.renderConicalGradient(
              context,
              this.stroke
            );
          } else if (this.stroke instanceof LinearGradient)
            context.strokeStyle = this.renderLinearGradient(
              context,
              this.stroke
            );
          else if (this.stroke instanceof RadialGradient)
            context.strokeStyle = this.renderRadialGradient(
              context,
              this.stroke
            );
        }
      }

      if (this.lineWidth !== null) context.lineWidth = this.lineWidth;
    }

    afterRender(canvas2D: Canvas2DCanvasElement): void {
      if (this.stroke !== "none" && this.stroke !== null)
        canvas2D.context.stroke();

      super.afterRender(canvas2D);
    }
  };
}

export function svgStroke<B extends SVGElementController>(Base: B) {
  return class extends baseStroke(Base) {
    connectedCallback() {
      super.connectedCallback();

      if (this.stroke instanceof Gradient) this.#strokeGradient(this.stroke);
    }

    get lineWidth() {
      return super.lineWidth;
    }

    set lineWidth(value) {
      if (super.lineWidth === value) return;

      super.lineWidth = value;

      const lineWidth = super.lineWidth;

      if (lineWidth === null) return;

      this._setStyleAttribute("stroke-width", lineWidth.toString());
    }

    get stroke() {
      return super.stroke;
    }

    set stroke(value) {
      if (super.stroke?.toString() === value?.toString()) return;

      super.stroke = value;

      const { stroke } = this;

      if (stroke === null) return;

      if (stroke instanceof Color)
        this._setStyleAttribute("stroke", stroke.toString());
      else if (stroke instanceof Gradient) this.#strokeGradient(stroke);
    }

    #strokeGradient(gradient: Gradient) {
      const { svgContainerController } = this;

      if (svgContainerController === null) return;

      const gradientId = svgContainerController._defineGradient(gradient);

      this._setStyleAttribute("stroke", `url(#${gradientId})`);
    }

    get _styleAttributes(): { [Key in keyof this]?: string } {
      return {
        ...super._styleAttributes,
        stroke: "stroke",
        lineWidth: "stroke-width",
      };
    }
  };
}

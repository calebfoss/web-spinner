import { Vector2D, Vector2DBase } from "../classes/vector2d";
import { CustomHTMLElement } from "../elements/mixable";
import { SVGElementController } from "../elements/svg/base";
import { attributeParser } from "../utlities/attributeParser";

export function offset<B extends typeof CustomHTMLElement>(Base: B) {
  return class extends Base {
    static observedAttributes = [...Base.observedAttributes, "offset"];

    #offset = new Vector2D(0, 0);

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (newValue !== null && name === "offset") {
        const newPosition = attributeParser.Vector2D(newValue);
        if (!this.#offset.equals(newPosition)) this.offset = newPosition;
      }

      return super.attributeChangedCallback(name, oldValue, newValue);
    }

    moveOffset(x: number, y: number) {
      if (x === 0 && y === 0) return;

      this.#offset.x += x;
      this.#offset.y += y;

      this.registerChange("offset", this.#offset);
    }

    #offsetChangeListener: ChangeListener<Vector2DBase> = (
      value: Vector2DBase
    ) => {
      this.registerChange(
        "offset",
        value instanceof Vector2D ? value : new Vector2D(value.x, value.y)
      );
    };

    /**
     * Position of the element's origin relative to its anchor.
     *
     * @attr
     * @reflect
     */
    get offset(): Vector2D {
      return this.#offset;
    }

    set offset(value) {
      this.#offset = this.#offset.replace(value, this.#offsetChangeListener);
    }
  };
}

export function extendSVGOffset<
  B extends SVGElementController & ReturnType<typeof offset>
>(Base: B) {
  return class extends Base {
    connectedCallback(): void {
      super.connectedCallback();
    }

    moveOffset(x: number, y: number): void {
      super.moveOffset(x, y);

      this.#updateOffset();
    }

    get offset() {
      return super.offset;
    }

    set offset(value) {
      super.offset = value;

      this.#updateOffset();
    }

    #updateOffset() {
      this.mainElement.setAttribute("x", this.offset.x.toString());
      this.mainElement.setAttribute("y", this.offset.y.toString());
    }
  };
}

export function svgOffset<B extends SVGElementController>(Base: B) {
  return extendSVGOffset(offset(Base));
}

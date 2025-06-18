import { Vector2D, Vector2DBase } from "../classes/vector2d";
import { CustomHTMLElement } from "../elements/mixable";
import { SVGElementController } from "../elements/visual/svgBase";
import { attributeParser } from "../utlities/attributeParser";

export function offset<B extends typeof CustomHTMLElement>(Base: B) {
  return class extends Base {
    static observedAttributes = [...Base.observedAttributes, "offset"];

    #offset = new Vector2D(0, 0);

    constructor(...args: any[]) {
      super(...args);

      this.#offset.addChangeListener(this.#offsetChangeListener);
    }

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
    }

    #offsetChangeListener: ChangeListener<Vector2DBase> = () => {
      this.registerChange("offset", this.#offset);
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
      const replace = this.#offset.replace.bind(this.#offset);

      replace((this.#offset = value), this.#offsetChangeListener);
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

      this._updateOffset();
    }

    get offset() {
      return super.offset;
    }

    set offset(value) {
      super.offset = value;

      this._updateOffset();
    }

    _updateOffset() {
      this.mainElement.setAttribute("x", this.offset.x.toString());
      this.mainElement.setAttribute("y", this.offset.y.toString());
    }
  };
}

export function svgOffset<B extends SVGElementController>(Base: B) {
  return extendSVGOffset(offset(Base));
}

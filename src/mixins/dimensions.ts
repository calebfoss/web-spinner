import { CustomHTMLElement } from "../elements/mixable";
import { SVGElementController } from "../elements/svg/base";
import { attributeParser } from "../utlities/attributeParser";

export function hasDimensions<B extends typeof CustomHTMLElement>(Base: B) {
  return class extends Base {
    static observedAttributes = [...Base.observedAttributes, "width", "height"];

    #width = 100;
    #height = 100;

    /**
     * Element's width in pixels.
     *
     * @attr
     * @reflect
     */
    get width(): number {
      return this.#width;
    }

    set width(value) {
      if (this.#width === value) return;

      this.registerChange("width", (this.#width = value));
    }

    /**
     * Element's height in pixels.
     *
     * @attr
     * @reflect
     */
    get height(): number {
      return this.#height;
    }

    set height(value) {
      if (this.#height === value) return;

      this.registerChange("height", (this.#height = value));
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (newValue === null)
        return super.attributeChangedCallback(name, oldValue, newValue);

      switch (name) {
        case "width":
          this.width = attributeParser.number(newValue);
          return;

        case "height":
          this.height = attributeParser.number(newValue);
          return;

        default:
          return super.attributeChangedCallback(name, oldValue, newValue);
      }
    }
  };
}

export function svgDimensions<B extends SVGElementController>(Base: B) {
  return class extends hasDimensions(Base) {
    connectedCallback(): void {
      this.mainElement.setAttribute("width", this.width.toString());
      this.mainElement.setAttribute("height", this.height.toString());

      super.connectedCallback();
    }

    get height() {
      return super.height;
    }

    set height(value) {
      if (value === super.height) return;

      super.height = value;

      this.mainElement.setAttribute("height", value.toString());
    }

    get width() {
      return super.width;
    }

    set width(value) {
      if (value === super.width) return;

      super.width = value;

      this.mainElement.setAttribute("width", value.toString());
    }
  };
}

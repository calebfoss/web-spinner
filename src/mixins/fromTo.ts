import { Vector2D } from "../classes/vector2d";
import { Canvas2DBaseRenderable } from "../elements/renderable";
import { attributeParser } from "../utlities/attributeParser";
import { c2dTransform } from "./transform";

export function hasTo<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class extends c2dTransform(Base) {
    static observedAttributes = [...super.observedAttributes, "to"];

    #to = Vector2D.xy(100, 100);

    /**
     * End point of the element relative to its anchor.
     *
     * @attr
     * @reflect
     */
    get to() {
      return this.#to;
    }

    set to(value) {
      if (this.#to.equals(value)) return;

      this.registerChange("to", (this.#to = value));
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (name === "to" && newValue !== null)
        this.to = attributeParser.Vector2D(newValue);

      super.attributeChangedCallback(name, oldValue, newValue);
    }
  };
}

export function hasFrom<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class extends Base {
    static observedAttributes = [...super.observedAttributes, "from"];

    #from = Vector2D.zero;

    /**
     * Starting point of the element relative to its anchor.
     *
     * @attr
     * @reflect
     */
    get from(): Vector2D {
      return this.#from;
    }

    set from(value) {
      if (this.#from.equals(value)) return;

      this.registerChange("from", (this.#from = value));
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (name === "from" && newValue !== null)
        this.from = attributeParser.Vector2D(newValue);

      super.attributeChangedCallback(name, oldValue, newValue);
    }
  };
}

import { Vector2D } from "../classes/vector2d";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";
import { transformeable } from "./transform";

export function hasTo<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class extends transformeable(Base) {
    static observedAttributes = [...Base.observedAttributes, "to"];

    #to = Vector2D.xy(100, 100);

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
    }
  };
}

export function hasFrom<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class extends Base {
    static observedAttributes = [...Base.observedAttributes, "from"];

    #from = Vector2D.zero;

    get from() {
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
    }
  };
}

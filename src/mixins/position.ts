import { Vector2D } from "../classes/vector2d";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";

export function positioned<B extends typeof Canvas2DBaseRenderable>(Base: B) {
  return class extends Base {
    static observedAttributes = [...Base.observedAttributes, "position"];

    #position = new Vector2D(0, 0);

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (newValue !== null && name === "position") {
        this.position = attributeParser.Vector2D(newValue);
      }

      return super.attributeChangedCallback(name, oldValue, newValue);
    }

    movePosition(x: number, y: number) {
      if (x === 0 && y === 0) return;

      this.#position.x += x;
      this.#position.y += y;

      this.registerChange("position", this.#position);
    }

    get position() {
      return this.#position;
    }

    set position(value) {
      if (this.#position.equals(value)) return;

      this.registerChange("position", (this.#position = value));
    }
  };
}

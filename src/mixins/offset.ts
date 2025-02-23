import { Vector2D } from "../classes/vector2d";
import { Canvas2DBaseRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";

export function offset<B extends typeof Canvas2DBaseRenderable>(Base: B) {
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

    #offsetChangeListener: ChangeListener<Vector2D> = (newValue) => {
      this.registerChange("offset", newValue);
    };

    get offset() {
      return this.#offset;
    }

    set offset(value) {
      if (this.#offset.equals(value)) {
        if (this.#offset !== value) {
          this.#offset.removeChangeListener(this.#offsetChangeListener);
          this.registerChange("offset", (this.#offset = value));
        }

        value.addChangeListener(this.#offsetChangeListener);
        return;
      }

      this.registerChange("offset", (this.#offset = value));

      value.addChangeListener(this.#offsetChangeListener);
    }
  };
}

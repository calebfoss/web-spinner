import { Color } from "./color";
import { createState } from "./state";
import { Vector2D } from "./vector2d";

export class Shadow {
  #blur = createState(0);
  #color = Color.gray(0);
  #offset = Vector2D.zero();
  #changeListenerMap = new Map<ChangeListener<Shadow>, () => void>();

  constructor(options: Partial<Shadow>) {
    Object.assign(this, options);
  }

  addChangeListener(listener: (updatedValue: Shadow) => void) {
    if (this.#changeListenerMap.has(listener)) return;

    const listenerCaller = () => listener(this);

    this.#blur.addChangeListener(listenerCaller);
    this.#offset.addChangeListener(listenerCaller);

    this.#changeListenerMap.set(listener, listenerCaller);
  }

  removeChangeListener(listener: ChangeListener<Shadow>) {
    const caller = this.#changeListenerMap.get(listener);

    if (caller === undefined) return;

    this.#blur.removeChangeListener(caller);
    this.#offset.removeChangeListener(caller);

    this.#changeListenerMap.delete(listener);
  }

  #changeListener = () => {
    this.#handleChange();
  };

  #handleChange() {
    for (const [_, caller] of this.#changeListenerMap) {
      caller();
    }
  }

  get blur() {
    return this.#blur.value;
  }

  set blur(value) {
    if (this.#blur.value === value) return;

    this.#blur.value = value;

    this.#handleChange();
  }

  get color() {
    return this.#color;
  }

  set color(value) {
    if (this.#color.equals(value)) return;

    this.#color = value;

    this.#handleChange();
  }

  equals(other: Shadow) {
    return (
      other.#blur === this.#blur &&
      other.#color.equals(this.#color) &&
      other.#offset.equals(this.#offset)
    );
  }

  get offset() {
    return this.#offset;
  }

  set offset(value) {
    if (this.#offset !== value) {
      this.#offset.removeChangeListener(this.#changeListener);

      value.addChangeListener(this.#changeListener);

      this.#offset = value;
    }

    if (!this.#offset.equals(value)) {
      this.#handleChange();
    }
  }

  render(context: CanvasRenderingContext2D) {
    context.shadowBlur = this.#blur.value;
    context.shadowColor = this.#color.toString();
    context.shadowOffsetX = this.#offset.x;
    context.shadowOffsetY = this.#offset.y;
  }
}

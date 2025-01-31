import { Vector2D } from "./vector2d";

export class ClickData extends Vector2D {
  #clicked = false;

  get clicked() {
    return this.#clicked;
  }

  set clicked(value) {
    this.#clicked = value;
  }
}

export class ClickTracker extends ClickData {
  #target: HTMLElement;

  constructor(target: HTMLElement) {
    super();

    this.#target = target;

    target.addEventListener("click", (event) => {
      super.clicked = true;

      super.x = event.x;

      super.y = event.y;
    });
  }

  advanceFrame() {
    super.clicked = false;
  }

  get clicked() {
    return super.clicked;
  }

  get position(): Vector2D {
    if (this.#target instanceof Window) return this;

    const boundingRect = this.#target.getBoundingClientRect();

    return Vector2D.xy(super.x - boundingRect.x, super.y - boundingRect.y);
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }
}

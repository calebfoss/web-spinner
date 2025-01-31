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
  constructor(target: HTMLElement) {
    super();

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
}

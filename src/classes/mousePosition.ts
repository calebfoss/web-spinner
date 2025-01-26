import { Vector2D } from "../classes/vector2d";

export class MousePosition extends Vector2D {
  constructor() {
    super();

    window.addEventListener("mousemove", (event) => {
      super.x = event.x;
      super.y = event.y;
    });
  }

  get x() {
    return super.x;
  }

  get y() {
    return super.y;
  }
}

import { Vector2D } from "./vector2d";

const buttonNames = { left: 0, right: 1, wheel: 2, back: 3, forward: 4 };

export class MouseData extends Vector2D {
  #buttonStates = [false, false, false, false, false];
  #over = false;

  get buttonStates() {
    return this.#buttonStates;
  }

  set buttonStates(value) {
    this.#buttonStates = value;
  }

  get over() {
    return this.#over;
  }

  set over(value) {
    this.#over = value;
  }
}

export class MouseTracker extends MouseData {
  #previous: MouseData;
  #target: HTMLElement | Window;

  constructor(target: HTMLElement | Window = window) {
    super();

    this.#target = target;

    this.#previous = new MouseData();

    (target as HTMLElement).addEventListener("mousedown", (event) => {
      super.buttonStates[event.button] = true;
    });

    (target as HTMLElement).addEventListener("mouseup", (event) => {
      super.buttonStates[event.button] = false;
    });

    target.addEventListener("mouseenter", (event) => {
      super.over = true;
    });

    target.addEventListener("mouseleave", (event) => {
      super.over = false;
    });

    (target as HTMLElement).addEventListener("mousemove", (event) => {
      super.x = event.x;
      super.y = event.y;
    });
  }

  advanceFrame() {
    this.#previous.buttonStates = [...this.buttonStates];

    this.#previous.over = this.over;

    this.#previous.x = this.x;

    this.#previous.y = this.y;
  }

  get buttonStates() {
    return super.buttonStates;
  }

  get over() {
    return super.over;
  }

  get position(): Vector2D {
    if (this.#target instanceof Window) return this;

    const boundingRect = this.#target.getBoundingClientRect();

    return Vector2D.xy(super.x - boundingRect.x, super.y - boundingRect.y);
  }

  get previous() {
    return this.#previous;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }
}

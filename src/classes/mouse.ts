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

    window.addEventListener("mousemove", (event) => {
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

  get previous() {
    return this.#previous;
  }

  get x() {
    if (this.#target instanceof Window) return super.x;

    const boundingRect = this.#target.getBoundingClientRect();

    return super.x - boundingRect.x;
  }

  get y() {
    if (this.#target instanceof Window) return super.y;

    const boundingRect = this.#target.getBoundingClientRect();

    return super.y - boundingRect.y;
  }
}

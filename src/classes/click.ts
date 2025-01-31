export class ClickData {
  #clicked = false;

  get clicked() {
    return this.#clicked;
  }

  set clicked(value) {
    this.#clicked = value;
  }
}

export class ClickTracker extends ClickData {
  constructor(target: HTMLElement | Window = window) {
    super();

    target.addEventListener("click", (event) => {
      super.clicked = true;
    });
  }

  advanceFrame() {
    super.clicked = false;
  }

  get clicked() {
    return super.clicked;
  }
}

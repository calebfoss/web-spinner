export class KeyboardTracker {
  #current = new Map<string, boolean>();
  #previous = new Map<string, boolean>();
  #last = "";
  #down = false;

  constructor() {
    window.addEventListener("keydown", (event) => {
      this.#current.set(event.key, true);

      this.#last = event.key;

      this.#down = true;
    });

    window.addEventListener("keyup", (event) => {
      this.#current.set(event.key, false);

      this.#down = false;

      for (const [_, state] of this.#current.entries()) {
        if (state) {
          this.#down = true;

          break;
        }
      }
    });
  }

  advanceFrame() {
    for (const [key, state] of this.#current.entries()) {
      this.#previous.set(key, state);
    }
  }

  get down() {
    return this.#down;
  }

  get last() {
    return this.#last;
  }

  keyHeld(key: string) {
    return this.#current.get(key) ?? false;
  }

  keyPreviouslyHeld(key: string) {
    return this.#previous.get(key) ?? false;
  }
}

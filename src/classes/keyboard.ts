export class KeyboardTracker {
  #current = new Set<string>();
  #previous = new Set<string>();
  #last = "";
  #down = false;

  constructor() {
    window.addEventListener("keydown", (event) => {
      this.#current.add(event.key);

      this.#last = event.key;

      this.#down = true;
    });

    window.addEventListener("keyup", (event) => {
      this.#current.delete(event.key);

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
    for (const key of this.#previous) {
      if (!this.#current.has(key)) this.#previous.delete(key);
    }

    for (const key of this.#current) {
      this.#previous.add(key);
    }
  }

  get down() {
    return this.#down;
  }

  get last() {
    return this.#last;
  }

  keyHeld(key: string) {
    return this.#current.has(key);
  }

  keyPreviouslyHeld(key: string) {
    return this.#previous.has(key);
  }
}

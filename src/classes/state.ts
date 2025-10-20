export class State<T> {
  #listeners = new Set<ChangeListener<T>>();
  #value: T;

  constructor(initialValue: T) {
    this.#value = initialValue;
  }

  /**
   * Adds a listener function to be called when the value changes.
   *
   * @param listener Function with 1 parameter: the changed value
   * @returns Array of listeners currently registered
   */

  addChangeListener(listener: ChangeListener<T>): ChangeListener<T>[] {
    this.#listeners.add(listener);

    return Array.from(this.#listeners);
  }

  /**
   * Removes a listener function so that it is no longer called when the value
   * changes
   *
   * @param listener Listener function to remove
   * @returns Array of listeners currently registered
   */

  removeChangeListener(listener: ChangeListener<T>): ChangeListener<T>[] {
    this.#listeners.delete(listener);

    return Array.from(this.#listeners);
  }

  protected handleChange() {
    for (const listener of this.#listeners) {
      listener(this.#value);
    }
  }

  /**
   * Checks if another State represents the same value.
   *
   * @param other State of same type
   * @returns
   */

  equals(other: T | State<T>): boolean {
    return this.#value === other;
  }

  /**
   * This method moves a listener from one State to another and returns the
   * other state.
   *
   * @param other Another State of the same type
   * @param changeListener
   * @returns
   */

  replace<O extends this>(other: O, changeListener: ChangeListener<T>): O {
    if (this.equals(other)) {
      if (this === other) return other;

      this.removeChangeListener(changeListener);
    }

    other.addChangeListener(changeListener);

    changeListener(other.#value);

    return other;
  }

  /**
   * Current value stored by this State.
   */

  get value(): T {
    return this.#value;
  }

  set value(newValue) {
    if (this.#value === newValue) return;

    this.#value = newValue;

    this.handleChange();
  }
}

export function createState<T>(target: T) {
  return new State(target);
}

export class State<T> {
  #listeners = new Set<ChangeListener<T>>();
  #value: T;

  constructor(initialValue: T) {
    this.#value = initialValue;
  }

  addChangeListener(listener: ChangeListener<T>) {
    this.#listeners.add(listener);

    return Array.from(this.#listeners);
  }

  removeChangeListener(listener: ChangeListener<T>) {
    this.#listeners.delete(listener);

    return Array.from(this.#listeners);
  }

  handleChange() {
    for (const listener of this.#listeners) {
      listener(this.#value);
    }
  }

  equals(other: T | State<T>) {
    return this.#value === other;
  }

  replace<O extends this>(other: O, changeListener: ChangeListener<T>) {
    if (this.equals(other)) {
      if (this === other) return other;

      this.removeChangeListener(changeListener);
    }

    other.addChangeListener(changeListener);

    changeListener(other.#value);

    return other;
  }

  get value() {
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

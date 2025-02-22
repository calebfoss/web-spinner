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

  get value() {
    return this.#value;
  }

  set value(newValue) {
    if (this.#value === newValue) return;

    this.#value = newValue;

    this.handleChange();
  }
}

type ObjectState<T extends object> = {
  [Key in keyof T]: T[Key] extends object ? ObjectState<T[Key]> : State<T[Key]>;
};

function deepState<T extends object>(target: T): ObjectState<T> {
  return Object.fromEntries(
    Object.entries(target).map(([propertyKey, propertyValue]) => [
      propertyKey as keyof T,
      typeof propertyValue === "object" && propertyValue !== null
        ? deepState(propertyValue)
        : new State(propertyValue),
    ])
  ) as ObjectState<T>;
}

export function createState<
  T,
  R extends T extends object ? ObjectState<T> : State<T>
>(target: T): R {
  if (typeof target === "object" && target !== null)
    return deepState(target) as R;

  return new State(target) as R;
}

const test = createState({
  foo: 123,
  bar: {
    a: true,
    b: "false",
  },
});

test.bar.a;

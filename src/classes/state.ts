type StateCallback<T> = (updatedValue: T) => StateCallback<T> | boolean;

export class State<T> {
  #callbacks: StateCallback<T>[] = [];
  #value: T;

  constructor(initialValue: T) {
    this.#value = initialValue;
  }

  depend(callback: StateCallback<T>) {
    this.#callbacks.push(callback);
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    if (this.#value === value) return;

    this.#value = value;

    this.#callbacks = this.#callbacks.reduce<StateCallback<T>[]>(
      (updatedCallbacks, callback) => {
        const updatedCallback = callback(value);

        if (updatedCallback === true) return updatedCallbacks.concat(callback);

        if (updatedCallback === false) return updatedCallbacks;

        return updatedCallbacks.concat(updatedCallback);
      },
      []
    );
  }
}

type StateArray<T extends any[]> = {
  [Index in keyof T]: Index extends number ? State<T[Index]> : T[Index];
};

type MultiStateCallback<T extends any[]> = (...updatedValues: T) => void;

export function depend<T extends any[]>(
  ...args: [...StateArray<T>, MultiStateCallback<T>]
) {
  const dependencies = args.slice(0, args.length - 1) as StateArray<T>;
  const callback = args[args.length - 1] as MultiStateCallback<T>;

  const initialValues = dependencies.map((dependency) => dependency.value) as T;

  for (const [index, state] of dependencies.entries()) {
    state.depend((updatedValue) => {
      initialValues[index] = updatedValue;

      callback(...initialValues);

      return true;
    });
  }
}

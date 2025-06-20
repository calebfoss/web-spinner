import { createCustomElement } from "../mixable";
import { Canvas2DCanvasElement } from "../visual/canvas";
import { DocumentContainerWrapper } from "./container";
import { SVGSVGController } from "../visual/svgSVG";
import { State } from "../../classes/state";

export function createHTMLElementWrapperConstructor<
  T extends keyof HTMLElementTagNameMap
>(tag: T) {
  return class HTMLElementWrapper {
    #element: HTMLElementTagNameMap[T];

    constructor(...args: any[]) {
      const element = document.createElement(tag);

      this.#element = element;
    }

    canvas2D(options?: Options<Canvas2DCanvasElement>) {
      const canvasController = createCustomElement(
        Canvas2DCanvasElement,
        options
      );

      this.element.appendChild(canvasController);

      return canvasController;
    }

    createWrappedChild<
      T extends keyof HTMLElementTagNameMap,
      W extends HTMLElementWrapperConstructor<T>
    >(
      WrapperConstructor: W,
      options?: Options<HTMLElementController<T, InstanceType<W>>>
    ): HTMLElementController<T, InstanceType<W>> {
      const controller = createWrappedController<T, W>(WrapperConstructor);

      this.element.appendChild(controller.element);

      Object.assign(controller, options);

      return controller;
    }

    get element() {
      return this.#element;
    }

    get style() {
      return this.#element.style;
    }

    set style(declaration: CSSStyleDeclaration) {
      Object.assign(this.#element.style, declaration);
    }

    svg(options?: Options<SVGSVGController>) {
      const svgSVGController = createCustomElement(SVGSVGController, options);

      this.element.appendChild(svgSVGController);

      return svgSVGController;
    }
  };
}

export type HTMLElementWrapperConstructor<
  T extends keyof HTMLElementTagNameMap
> = ReturnType<typeof createHTMLElementWrapperConstructor<T>>;

export type TemplateApplier<
  T extends keyof HTMLElementTagNameMap,
  W extends InstanceType<HTMLElementWrapperConstructor<T>>
> = (
  strings: TemplateStringsArray,
  ...values: any[]
) => HTMLElementController<T, W>;

export type HTMLElementController<
  T extends keyof HTMLElementTagNameMap,
  W extends InstanceType<HTMLElementWrapperConstructor<T>>
> = HTMLElementTagNameMap[T] & W & TemplateApplier<T, W>;

type StateListener<T> = {
  state: State<T>;
  changeListener: (newValue: T) => void;
};

const createStateListener = <T>(
  state: State<T>,
  changeListener: (newValue: T) => void
): StateListener<T> => ({ state, changeListener });

export function createWrappedController<
  T extends keyof HTMLElementTagNameMap,
  W extends HTMLElementWrapperConstructor<T>
>(WrapperConstructor: W): HTMLElementController<T, InstanceType<W>> {
  const wrapper = new WrapperConstructor();

  const { element } = wrapper;

  const stateMap = new Map<PropertyKey, StateListener<any>>();

  function applyTemplate(strings: TemplateStringsArray, ...values: any[]) {
    for (const [index, str] of strings.entries()) {
      const textNode = new Text(str);

      element.appendChild(textNode);

      if (index < values.length) {
        const value = values[index];

        if (value instanceof State) {
          let mutableTextNode = new Text(value.value);

          element.appendChild(mutableTextNode);

          const stateListener = createStateListener(value, (newValue) => {
            const newText = new Text(newValue);

            element.replaceChild(newText, mutableTextNode);

            mutableTextNode = newText;
          });

          value.addChangeListener(stateListener.changeListener);
        } else {
          const neighborNode = value instanceof Node ? value : new Text(value);

          element.appendChild(neighborNode);
        }
      }
    }

    return controller;
  }

  const controller = new Proxy(applyTemplate, {
    get(_, propertyKey) {
      const wrapperValue = Reflect.get(wrapper, propertyKey);

      if (wrapperValue !== undefined) {
        if (typeof wrapperValue === "function")
          return wrapperValue.bind(wrapper);

        return wrapperValue;
      }

      const elementValue = Reflect.get(element, propertyKey);

      if (typeof elementValue === "function") return elementValue.bind(element);

      return elementValue;
    },
    set(_, propertyKey, value) {
      const oldStateListener = stateMap.get(propertyKey);

      if (oldStateListener !== undefined) {
        oldStateListener.state.removeChangeListener(
          oldStateListener.changeListener
        );
      }

      if (propertyKey in wrapper) {
        if (value instanceof State) {
          const newStateListener = createStateListener(value, (newValue) => {
            Reflect.set(wrapper, propertyKey, newValue);
          });

          value.addChangeListener(newStateListener.changeListener);

          stateMap.set(propertyKey, newStateListener);

          return Reflect.set(wrapper, propertyKey, value.value);
        }

        return Reflect.set(wrapper, propertyKey, value);
      }

      if (value instanceof State) {
        const newStateListener = createStateListener(value, (newValue) => {
          Reflect.set(element, propertyKey, newValue);
        });

        value.addChangeListener(newStateListener.changeListener);

        stateMap.set(propertyKey, newStateListener);

        return Reflect.set(element, propertyKey, value.value);
      }

      return Reflect.set(element, propertyKey, value);
    },
  }) as HTMLElementController<T, InstanceType<W>>;

  return controller;
}

export function createRoot(rootParent = document.body) {
  if (rootParent === undefined)
    throw new Error(
      `Root element's parent is undefined. Make sure your script runs after the DOM content loads. You can do this by adding the 'defer' attribute.`
    );

  const rootController = createWrappedController(DocumentContainerWrapper);

  rootParent.appendChild(rootController.element);

  return rootController;
}

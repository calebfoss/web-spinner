import { createCustomElement } from "../elements/mixable";
import { Canvas2DCanvasElement } from "./canvas";
import { HTMLContainerWrapper } from "./container";
import { SVGSVGController } from "./svgSVG";

export function createHTMLElementWrapperConstructor<
  T extends keyof HTMLElementTagNameMap
>(tag: T) {
  return class HTMLElementWrapper {
    #controller: HTMLElementController<T, this>;
    #element: HTMLElementTagNameMap[T];

    constructor(...args: any[]) {
      const element = document.createElement(tag);

      this.#element = element;

      function applyTemplate(strings: TemplateStringsArray, ...values: any[]) {
        for (const [index, str] of strings.entries()) {
          const textNode = new Text(str);

          element.appendChild(textNode);

          if (index < values.length) {
            const value = values[index];

            const neighborNode =
              value instanceof Node ? value : new Text(value);

            element.appendChild(neighborNode);
          }
        }

        return controller;
      }

      const wrapper = this;

      const controller = new Proxy(applyTemplate, {
        get(_, propertyKey) {
          const wrapperValue = Reflect.get(wrapper, propertyKey);

          if (wrapperValue !== undefined) {
            if (typeof wrapperValue === "function")
              return wrapperValue.bind(wrapper);

            return wrapperValue;
          }

          const elementValue = Reflect.get(element, propertyKey);

          if (typeof elementValue === "function")
            return elementValue.bind(element);

          return elementValue;
        },
        set(_, propertyKey, value) {
          if (propertyKey in wrapper)
            return Reflect.set(wrapper, propertyKey, value);

          return Reflect.set(element, propertyKey, value);
        },
      }) as HTMLElementController<T, this>;

      this.#controller = controller;
    }

    canvas2D(options?: Options<Canvas2DCanvasElement>) {
      const canvasController = createCustomElement(
        Canvas2DCanvasElement,
        options
      );

      this.element.appendChild(canvasController);

      return canvasController;
    }

    get controller() {
      return this.#controller;
    }

    createChild<T extends keyof HTMLElementTagNameMap>(tag: T) {
      const WrapperConstructor = createHTMLElementWrapperConstructor(tag);

      const wrapper = new WrapperConstructor();

      this.element.appendChild(wrapper.element);

      const { controller } = wrapper;

      return controller;
    }

    get element() {
      return this.#element;
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

export function createRoot(rootParent = document.body) {
  if (rootParent === undefined)
    throw new Error(
      `Root element's parent is undefined. Make sure your script runs after the DOM content loads. You can do this by adding the 'defer' attribute.`
    );

  const rootWrapper = new HTMLContainerWrapper();

  const rootController = rootWrapper.controller;

  rootParent.appendChild(rootController.element);

  return rootController;
}

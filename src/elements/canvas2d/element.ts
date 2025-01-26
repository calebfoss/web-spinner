import { Canvas2DElementTagMap } from "../..";
import { ChildCreator } from "../../mixins/children";
import { createCustomCanvas2D } from "../../utlities/createCustomElement";

export class Canvas2DElement extends HTMLElement {
  static observedAttributes: string[] = [];

  constructor(...args: any[]) {
    super();
  }

  #eventProxy = (() => {
    const element = this;
    return new Proxy(
      {} as {
        [EventName in keyof HTMLElementEventMap]: (
          listener: TypedEventListener<EventName>
        ) => void;
      },
      {
        get<E extends keyof HTMLElementEventMap>(_: never, eventName: E) {
          return (listener: TypedEventListener<E>) =>
            element.addEventListener(eventName, listener);
        },
      }
    );
  })();
  #everyFrame: Updater | null = null;

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {}

  createChild<T extends keyof Canvas2DElementTagMap>(
    tag: T
  ): ChildCreator<Canvas2DElementTagMap[T]> {
    const parentElement = this;

    return function (options) {
      const element = createCustomCanvas2D(tag);

      parentElement.appendChild(element);

      Object.assign(element, options);

      return element;
    };
  }

  get everyFrame() {
    return this.#everyFrame;
  }

  set everyFrame(updater) {
    this.#everyFrame = updater;
  }

  get listen() {
    return this.#eventProxy;
  }
}

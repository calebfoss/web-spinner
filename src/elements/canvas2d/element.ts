import { Canvas2DElementTagMap } from "../..";
import { ChildCreator } from "../../mixins/children";
import { createCustomCanvas2D } from "../../utlities/createCustomElement";
import { Canvas2DCanvasElement } from "./canvas";

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

  get canvas(): Canvas2DCanvasElement {
    const { parentElement } = this;

    if (
      parentElement === null ||
      parentElement instanceof Canvas2DElement === false
    )
      throw new Error("Canvas2D renderable is not a child of a Canvas2DCanvas");

    if (parentElement instanceof Canvas2DCanvasElement) return parentElement;

    return parentElement.canvas;
  }

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

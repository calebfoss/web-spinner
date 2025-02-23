import { createCustomElement } from "../..";
import { Vector2D } from "../../classes/vector2d";
import { Canvas2DCanvasElement } from "./canvas";

export class Canvas2DElement extends HTMLElement {
  static observedAttributes: string[] = [];
  static tag: string;

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

  createChild<E extends typeof Canvas2DElement>(
    ElementClass: E,
    options?: Options<InstanceType<E>>
  ) {
    const element = createCustomElement(ElementClass, options);

    this.appendChild(element);

    return element;
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

  scaleByPixelRatio(vector: Vector2D) {
    const point = new DOMPointReadOnly(vector.x, vector.y).matrixTransform(
      new DOMMatrix().scale(devicePixelRatio, devicePixelRatio)
    );

    return Vector2D.xy(point.x, point.y);
  }
}

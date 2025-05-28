import { Vector2D } from "../../classes/vector2d";
import { CustomHTMLElement } from "../mixable";
import { Canvas2DCanvasElement } from "./canvas";

type EventListenerAdder = {
  readonly [EventName in keyof HTMLElementEventMap]: (
    listener: TypedEventListener<EventName>
  ) => void;
};

export class Canvas2DElement extends CustomHTMLElement {
  /**
   * The element's custom HTML tag. This can be passed into document.createElement().
   */
  static tag: string;

  #eventProxy = (() => {
    const element = this;
    return new Proxy({} as EventListenerAdder, {
      get<E extends keyof HTMLElementEventMap>(_: never, eventName: E) {
        return (listener: TypedEventListener<E>) =>
          element.addEventListener(eventName, listener);
      },
    });
  })();
  #everyFrame: Updater | null = null;

  /**
   * The <c2d-canvas> element that is rendering this element. The <c2d-canvas>
   * will be an ancestor of this element.
   */
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

  /**
   * Function called before rendering. The function has one parameter: the
   * current frame number.
   */
  get everyFrame(): Updater | null {
    return this.#everyFrame;
  }

  set everyFrame(updater) {
    this.#everyFrame = updater;
  }

  /**
   * Interface for adding event listeners with alternative syntax. For example,
   * element.addEventListener("click", listener) becomes
   * element.listen.click(listener).
   */
  get listen(): EventListenerAdder {
    return this.#eventProxy;
  }

  /**
   * Scales a vector by the device's pixel ratio.
   */
  scaleByPixelRatio(vector: Vector2D) {
    const point = new DOMPointReadOnly(vector.x, vector.y).matrixTransform(
      new DOMMatrix().scale(devicePixelRatio, devicePixelRatio)
    );

    return Vector2D.xy(point.x, point.y);
  }
}

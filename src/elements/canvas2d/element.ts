import { CanvasRectangle } from "./rectangle";

type ChildCreator<E extends Canvas2DElement> = (options?: Partial<E>) => E;

export class Canvas2DElement extends HTMLElement {
  #everyFrame: Updater | null = null;

  createChild<T extends keyof Canvas2DElementTagMap>(
    tag: T
  ): ChildCreator<Canvas2DElementTagMap[T]> {
    const element = document.createElement(tag) as Canvas2DElementTagMap[T];

    this.appendChild(element);

    return function (options) {
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

  get rectangle(): ChildCreator<CanvasRectangle> {
    return this.createChild("z-rectangle");
  }
}

import { Canvas2DElementTagMap } from "../..";
import { createCustomCanvas2D } from "../../utlities/createCustomElement";
import { Canvas2DRectangle } from "./rectangle";
import { Canvas2DText } from "./text";

type ChildCreator<E extends Canvas2DElement> = (options?: Partial<E>) => E;

export class Canvas2DElement extends HTMLElement {
  static observedAttributes: string[] = [];

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

  get rectangle(): ChildCreator<Canvas2DRectangle> {
    return this.createChild("canvas-2d-rectangle");
  }

  get text(): ChildCreator<Canvas2DText> {
    return this.createChild("canvas-2d-text");
  }
}

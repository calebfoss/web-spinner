import { Canvas2DCanvasElement } from "./elements/canvas2d/canvas";
import { CanvasRectangle } from "./elements/canvas2d/rectangle";
import { Color as ColorImport } from "./classes/color";
import { Vector2D as Vector2DImport } from "./classes/vector2d";
import { Angle as AngleImport } from "./classes/angle";

export const NONE = "none";

function range(stop: number): IterableIterator<number>;
function range(start: number, stop: number): IterableIterator<number>;
function range(arg1: number, arg2?: number): IterableIterator<number> {
  const [start, stop] = arg2 === undefined ? [0, arg1] : [arg1, arg2];

  const step = stop > start ? 1 : -1;

  let value = start;

  function next(): IteratorResult<number> {
    const result = {
      value,
      done: start + step === stop,
    };

    value += step;

    return result;
  }

  return {
    [Symbol.iterator]() {
      return this;
    },
    next,
  };
}

export function createMultiple<R extends Node>(
  count: number,
  generator: (index: number) => R
) {
  return new Array(count).fill(0).map((_, index) => generator(index));
}

customElements.define("z-canvas", Canvas2DCanvasElement);

export function createCanvas(options?: Partial<Canvas2DCanvasElement>) {
  const element = document.createElement("z-canvas") as Canvas2DCanvasElement;

  Object.assign(element, options);

  return element;
}

customElements.define("z-rectangle", CanvasRectangle);

export const Color = ColorImport;

export const Vector2D = Vector2DImport;

export const Angle = AngleImport;

const webSpinner = {
  createCanvas,
  createMultiple,
  Color,
  Vector2D,
  Angle,
} as const;

export default webSpinner;

window.webSpinner = webSpinner;

declare global {
  interface Window {
    webSpinner: typeof webSpinner;
  }
}

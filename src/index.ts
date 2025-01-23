import { Canvas2DCanvasElement } from "./elements/canvas2d/canvas";
import { Canvas2DRectangle } from "./elements/canvas2d/rectangle";
import { Color as ColorImport } from "./classes/color";
import { Vector2D as Vector2DImport } from "./classes/vector2d";
import { Angle as AngleImport } from "./classes/angle";
import { Canvas2DText } from "./elements/canvas2d/text";
import { createCustomCanvas2D } from "./utlities/createCustomElement";
import { Units } from "./classes/units";

export type Canvas2DClassTagMap = {
  ["canvas-2d"]: typeof Canvas2DCanvasElement;
  ["canvas-2d-rectangle"]: typeof Canvas2DRectangle;
  ["canvas-2d-text"]: typeof Canvas2DText;
};

export type Canvas2DElementTagMap = {
  [Tag in keyof Canvas2DClassTagMap]: InstanceType<Canvas2DClassTagMap[Tag]>;
};

export type CSSLengthUnit = (typeof Units.size)[keyof typeof Units.size];

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

function defineCustom<T extends keyof Canvas2DClassTagMap>(
  tag: T,
  ElementClass: Canvas2DClassTagMap[T]
) {
  return customElements.define(tag, ElementClass);
}

defineCustom("canvas-2d", Canvas2DCanvasElement);

defineCustom("canvas-2d-rectangle", Canvas2DRectangle);

defineCustom("canvas-2d-text", Canvas2DText);

export function createCanvas(options?: Partial<Canvas2DCanvasElement>) {
  const element = createCustomCanvas2D("canvas-2d");

  Object.assign(element, options);

  return element;
}

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

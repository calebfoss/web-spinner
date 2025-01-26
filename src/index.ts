import { Canvas2DCanvasElement } from "./elements/canvas2d/canvas";
import {
  Canvas2DRectangle,
  Canvas2DShapeRectangle,
} from "./elements/canvas2d/rectangle";
import { Color as ColorImport } from "./classes/color";
import { Vector2D as Vector2DImport } from "./classes/vector2d";
import { Angle as AngleImport } from "./classes/angle";
import { Canvas2DText } from "./elements/canvas2d/text";
import { createCustomCanvas2D } from "./utlities/createCustomElement";
import { Units } from "./classes/units";
import { State as StateImport, depend as dependImport } from "./classes/state";
import { Canvas2DLine, Canvas2DShapeLine } from "./elements/canvas2d/line";
import { Canvas2DShape } from "./elements/canvas2d/shape";

export type Canvas2DClass = {
  ["ct2-canvas"]: typeof Canvas2DCanvasElement;
  ["ct2-line"]: typeof Canvas2DLine;
  ["ct2-rectangle"]: typeof Canvas2DRectangle;
  ["ct2-text"]: typeof Canvas2DText;
  ["ct2-shape"]: typeof Canvas2DShape;
  ["ct2-shape-line"]: typeof Canvas2DShapeLine;
  ["ct2-shape-rectangle"]: typeof Canvas2DShapeRectangle;
};

export type Canvas2DElementTagMap = {
  [Tag in keyof Canvas2DClass]: InstanceType<Canvas2DClass[Tag]>;
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

function defineCustom<T extends keyof Canvas2DClass>(
  tag: T,
  ElementClass: Canvas2DClass[T]
) {
  return customElements.define(tag, ElementClass);
}

defineCustom("ct2-canvas", Canvas2DCanvasElement);

defineCustom("ct2-line", Canvas2DLine);

defineCustom("ct2-rectangle", Canvas2DRectangle);

defineCustom("ct2-shape", Canvas2DShape);

defineCustom("ct2-shape-line", Canvas2DShapeLine);

defineCustom("ct2-shape-rectangle", Canvas2DShapeRectangle);

defineCustom("ct2-text", Canvas2DText);

export function createCanvas(options?: Partial<Canvas2DCanvasElement>) {
  const element = createCustomCanvas2D("ct2-canvas");

  Object.assign(element, options);

  return element;
}

export const Color = ColorImport;

export const Vector2D = Vector2DImport;

export const Angle = AngleImport;

export const State = StateImport;

export const depend = dependImport;

const webSpinner = {
  createCanvas,
  createMultiple,
  Color,
  Vector2D,
  Angle,
  State,
  depend,
} as const;

export default webSpinner;

window.webSpinner = webSpinner;

declare global {
  interface Window {
    webSpinner: typeof webSpinner;
  }
}

import { Canvas2DCanvasElement } from "./elements/canvas2d/canvas";
import {
  Canvas2DRectangle,
  Canvas2DShapeRectangle,
} from "./elements/canvas2d/rectangle";
import { Color } from "./classes/color";
import { Vector2D } from "./classes/vector2d";
import { Angle } from "./classes/angle";
import { Canvas2DText } from "./elements/canvas2d/text";
import { Units } from "./classes/units";
import { State, createState } from "./classes/state";
import { Canvas2DLine, Canvas2DShapeLine } from "./elements/canvas2d/line";
import { Canvas2DShape } from "./elements/canvas2d/shape";
import {
  Canvas2DEllipse,
  Canvas2DShapeEllipse,
} from "./elements/canvas2d/ellipse";
import {
  Canvas2DBezier,
  Canvas2DShapeBezier,
} from "./elements/canvas2d/bezier";
import { Canvas2DImage } from "./elements/canvas2d/image";
import { Canvas2DVideo } from "./elements/canvas2d/video";
import {
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "./classes/gradient";
import { Canvas2DElement } from "./elements/canvas2d/element";

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

function createMultiple<R extends Node>(
  count: number,
  generator: (index: number) => R
) {
  return new Array(count).fill(0).map((_, index) => generator(index));
}

declare global {
  interface CustomElementRegistry {
    define<E extends typeof Canvas2DElement>(
      tag: E["tag"],
      ElementClass: E
    ): void;
  }
}

export function createCustomElement<
  E extends typeof HTMLElement & { tag: string }
>(ElementClass: E, options?: Options<InstanceType<E>>) {
  const element = document.createElement(ElementClass.tag) as InstanceType<E>;

  Object.assign(element, options);

  return element;
}

const elementClasses = [
  Canvas2DCanvasElement,
  Canvas2DBezier,
  Canvas2DEllipse,
  Canvas2DImage,
  Canvas2DLine,
  Canvas2DRectangle,
  Canvas2DShape,
  Canvas2DShapeBezier,
  Canvas2DShapeEllipse,
  Canvas2DShapeLine,
  Canvas2DShapeRectangle,
  Canvas2DText,
  Canvas2DVideo,
];

for (const elementClass of elementClasses) {
  const tag = customElements.getName(elementClass);
  const ctor = customElements.get(elementClass.tag);

  if (tag === null || ctor === undefined) {
    throw new Error(
      `Constructor ${elementClass.name} has not been registered.`
    );
  } else if (tag !== elementClass.tag) {
    throw new Error(
      `Tag mismatch detected. Constructor's tag: ${elementClass.tag} Registered tag: ${tag}.`
    );
  } else if (ctor !== elementClass) {
    throw new Error(`Constructor mismatch.`);
  }
}

function createCanvas(options?: Options<Canvas2DCanvasElement>) {
  return createCustomElement(Canvas2DCanvasElement, options);
}

export {
  createCanvas,
  createMultiple,
  Color,
  Vector2D,
  Angle,
  State,
  ConicalGradient,
  LinearGradient,
  RadialGradient,
  createState,
};

// declare global {
//   interface Window {
//     webSpinner: typeof webSpinner;
//   }
// }

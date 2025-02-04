import { Canvas2DCanvasElement } from "./elements/canvas2d/canvas";
import {
  Canvas2DRectangle,
  Canvas2DShapeRectangle,
} from "./elements/canvas2d/rectangle";
import { Color } from "./classes/color";
import { Vector2D } from "./classes/vector2d";
import { Angle } from "./classes/angle";
import { Canvas2DText } from "./elements/canvas2d/text";
import { createCustomCanvas2D } from "./utlities/createCustomElement";
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

export type Canvas2DClass = {
  ["c2d-bezier"]: typeof Canvas2DBezier;
  ["c2d-canvas"]: typeof Canvas2DCanvasElement;
  ["c2d-ellipse"]: typeof Canvas2DEllipse;
  ["c2d-image"]: typeof Canvas2DImage;
  ["c2d-line"]: typeof Canvas2DLine;
  ["c2d-rectangle"]: typeof Canvas2DRectangle;
  ["c2d-shape"]: typeof Canvas2DShape;
  ["c2d-shape-bezier"]: typeof Canvas2DShapeBezier;
  ["c2d-shape-ellipse"]: typeof Canvas2DShapeEllipse;
  ["c2d-shape-line"]: typeof Canvas2DShapeLine;
  ["c2d-shape-rectangle"]: typeof Canvas2DShapeRectangle;
  ["c2d-text"]: typeof Canvas2DText;
  ["c2d-video"]: typeof Canvas2DVideo;
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

defineCustom("c2d-bezier", Canvas2DBezier);

defineCustom("c2d-canvas", Canvas2DCanvasElement);

defineCustom("c2d-ellipse", Canvas2DEllipse);

defineCustom("c2d-image", Canvas2DImage);

defineCustom("c2d-line", Canvas2DLine);

defineCustom("c2d-rectangle", Canvas2DRectangle);

defineCustom("c2d-shape", Canvas2DShape);

defineCustom("c2d-shape-bezier", Canvas2DShapeBezier);

defineCustom("c2d-shape-ellipse", Canvas2DShapeEllipse);

defineCustom("c2d-shape-line", Canvas2DShapeLine);

defineCustom("c2d-shape-rectangle", Canvas2DShapeRectangle);

defineCustom("c2d-text", Canvas2DText);

defineCustom("c2d-video", Canvas2DVideo);

function createCanvas(options?: Partial<Canvas2DCanvasElement>) {
  const element = createCustomCanvas2D("c2d-canvas");

  Object.assign(element, options);

  return element;
}

export default {
  createCanvas,
  createMultiple,
  Color,
  Vector2D,
  Angle,
  State,
  createState,
};

// declare global {
//   interface Window {
//     webSpinner: typeof webSpinner;
//   }
// }

import { Canvas2DCanvasElement } from "./elements/canvas";
import {
  Canvas2DRectangle,
  Canvas2DShapeRectangle,
} from "./elements/rectangle";
import { Color } from "./classes/color";
import { Vector2D } from "./classes/vector2d";
import { Angle } from "./classes/angle";
import { Canvas2DText } from "./elements/text";
import { Units } from "./classes/units";
import { State, createState } from "./classes/state";
import { Canvas2DLine, Canvas2DShapeLine } from "./elements/line";
import { Canvas2DShape } from "./elements/shape";
import { Canvas2DEllipse, Canvas2DShapeEllipse } from "./elements/ellipse";
import { Canvas2DBezier, Canvas2DShapeBezier } from "./elements/bezier";
import { Canvas2DImage } from "./elements/image";
import { Canvas2DVideo } from "./elements/video";
import {
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "./classes/gradient";
import { C2DBase } from "./elements/c2dBase";
import { Shadow } from "./classes/shadow";
import { createRoot } from "./elements/domBase";

export type CSSLengthUnit = (typeof Units.size)[keyof typeof Units.size];

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
    define<E extends typeof C2DBase>(tag: E["tag"], ElementClass: E): void;
  }
}

customElements.define("c2d-canvas", Canvas2DCanvasElement);

export type WebSpinnerElement = {
  Canvas2DCanvasElement: Canvas2DCanvasElement;
  Canvas2DBezier: Canvas2DBezier;
  Canvas2DEllipse: Canvas2DEllipse;
  Canvas2DImage: Canvas2DImage;
  Canvas2DLine: Canvas2DLine;
  Canvas2DRectangle: Canvas2DRectangle;
  Canvas2DShape: Canvas2DShape;
  Canvas2DShapeBezier: Canvas2DShapeBezier;
  Canvas2DShapeEllipse: Canvas2DShapeEllipse;
  Canvas2DShapeLine: Canvas2DShapeLine;
  Canvas2DShapeRectangle: Canvas2DShapeRectangle;
  Canvas2DText: Canvas2DText;
  Canvas2DVideo: Canvas2DVideo;
};

export {
  createMultiple,
  Color,
  Vector2D,
  Angle,
  State,
  ConicalGradient,
  LinearGradient,
  RadialGradient,
  Shadow,
  createState,
  createRoot,
};

import { Canvas2DCanvasElement } from "./elements/visual/canvas";
import {
  Canvas2DRectangle,
  Canvas2DShapeRectangle,
} from "./elements/visual/rectangle";
import { Color } from "./classes/color";
import { Vector2D } from "./classes/vector2d";
import { Angle } from "./classes/angle";
import { Canvas2DText } from "./elements/visual/text";
import { Units } from "./classes/units";
import { State, createState } from "./classes/state";
import { Canvas2DLine, Canvas2DShapeLine } from "./elements/visual/line";
import { Canvas2DShape } from "./elements/visual/shape";
import {
  Canvas2DEllipse,
  Canvas2DShapeEllipse,
} from "./elements/visual/ellipse";
import { Canvas2DBezier, Canvas2DShapeBezier } from "./elements/visual/bezier";
import { Canvas2DImage } from "./elements/visual/image";
import { Canvas2DVideo } from "./elements/visual/video";
import {
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "./classes/gradient";
import { C2DBase } from "./elements/visual/c2dBase";
import { Shadow } from "./classes/shadow";
import { createRoot } from "./elements/document/domBase";
import { BorderRadius } from "./classes/borderRadius";
import { Random } from "./classes/random";
import { CustomHTMLElement } from "./elements/mixable";

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

type ElementMap = {
  parentElement: typeof CustomHTMLElement;
  [name: string]: typeof CustomHTMLElement | ElementMap;
};

const elements: { [category: string]: ElementMap } = {
  canvas2D: {
    parentElement: Canvas2DCanvasElement,
    Canvas2DBezier,
    shape: {
      parentElement: Canvas2DShape,
      Canvas2DBezier,
      Canvas2DShapeEllipse,
      Canvas2DShapeLine,
      Canvas2DShapeRectangle,
    },
  },
};

export {
  createMultiple,
  BorderRadius,
  Color,
  Vector2D,
  Angle,
  State,
  ConicalGradient,
  LinearGradient,
  RadialGradient,
  Random,
  Shadow,
  createState,
  createRoot,
  elements as Elements,
};

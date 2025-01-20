import { Canvas2DElementTagMap } from "..";

export function createCustomCanvas2D<T extends keyof Canvas2DElementTagMap>(
  tag: T
) {
  return document.createElement(tag) as Canvas2DElementTagMap[T];
}

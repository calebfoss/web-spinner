import { Canvas2DCanvasElement } from "../dist/types/elements/visual/canvas";

type ElementTestSetup<T> = () => {
  canvas: Canvas2DCanvasElement;
  element: Element & T;
};

type ElementTestTeardown = (
  canvas: Canvas2DCanvasElement,
  element: Element
) => void;

type VoidCanvasMethods = {
  [Key in keyof CanvasRenderingContext2D as ((
    ...args: any[]
  ) => void) extends CanvasRenderingContext2D[Key]
    ? Key
    : never]: CanvasRenderingContext2D[Key];
};

type VoidCanvasMethodNames = keyof VoidCanvasMethods;

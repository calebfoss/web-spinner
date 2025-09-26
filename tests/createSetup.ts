import { createRoot } from "web-spinner";
import { ElementTestSetup } from "./types";
import { Canvas2DCanvasElement } from "../dist/types/elements/visual/canvas";

type Canvas2DElementChildName = {
  [Key in keyof Canvas2DCanvasElement]: Canvas2DCanvasElement[Key] extends (
    ...args: any
  ) => Element
    ? Key
    : never;
}[keyof Canvas2DCanvasElement];

export function createCanvasElementSetup<T extends Element>(
  method: Canvas2DElementChildName
): ElementTestSetup<T> {
  return () => {
    const root = createRoot();

    const canvas = root.canvas2D();

    const element = canvas[method]();

    const teardown = root.remove.bind(root);

    return { canvas, element, teardown };
  };
}

import { rendersVisualMedia } from "../../mixins/visualMedia";
import { Canvas2DStandaloneRenderable } from "./renderable";

export class Canvas2DImage extends rendersVisualMedia(
  Canvas2DStandaloneRenderable,
  "img"
) {}

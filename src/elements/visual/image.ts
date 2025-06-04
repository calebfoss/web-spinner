import { rendersVisualMedia } from "../../mixins/visualMedia";
import { Canvas2DStandaloneRenderable } from "./renderable";

export class Canvas2DImage extends rendersVisualMedia(
  Canvas2DStandaloneRenderable,
  "img"
) {
  static get tag() {
    return "c2d-image";
  }
}

customElements.define("c2d-image", Canvas2DImage);

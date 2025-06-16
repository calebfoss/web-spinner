import { C2DStandaloneTransformed } from "../../mixins/transform";
import { rendersVisualMedia } from "../../mixins/visualMedia";

export class Canvas2DImage extends rendersVisualMedia(
  C2DStandaloneTransformed,
  "img"
) {
  static get tag() {
    return "c2d-image";
  }
}

customElements.define("c2d-image", Canvas2DImage);

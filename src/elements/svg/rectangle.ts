import { svgDimensions } from "../../mixins/dimensions";
import { createSVGController } from "./base";

export class SVGRectangleController extends svgDimensions(
  createSVGController("rect", "svg-rectangle")
) {}

customElements.define("svg-rectangle", SVGRectangleController);

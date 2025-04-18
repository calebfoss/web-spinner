import { svgChildren } from "../../mixins/children";
import { svgDimensions } from "../../mixins/dimensions";
import { svgFill } from "../../mixins/fill";
import { createSVGController } from "./base";

export class SVGRectangleController extends svgFill(
  svgDimensions(svgChildren(createSVGController("rect", "svg-rectangle")))
) {}

customElements.define("svg-rectangle", SVGRectangleController);

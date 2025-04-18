import { svgChildren } from "../../mixins/children";
import { svgDimensions } from "../../mixins/dimensions";
import { svgFill } from "../../mixins/fill";
import { svgStroke } from "../../mixins/stroke";
import { createSVGController } from "./base";

export class SVGRectangleController extends svgStroke(
  svgFill(
    svgDimensions(svgChildren(createSVGController("rect", "svg-rectangle")))
  )
) {}

customElements.define("svg-rectangle", SVGRectangleController);

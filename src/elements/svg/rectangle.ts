import { svgChildren } from "../../mixins/children";
import { svgDimensions } from "../../mixins/dimensions";
import { svgFill } from "../../mixins/fill";
import { svgRectangleBounds } from "../../mixins/rectangleBounds";
import { svgStroke } from "../../mixins/stroke";
import { createSVGController } from "./base";

export class SVGRectangleController extends svgStroke(
  svgFill(
    svgDimensions(
      svgRectangleBounds(
        svgChildren(createSVGController("rect", "svg-rectangle"))
      )
    )
  )
) {}

customElements.define("svg-rectangle", SVGRectangleController);

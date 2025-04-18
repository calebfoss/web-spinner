import { createCustomElement } from "../..";
import { svgChildren } from "../../mixins/children";
import { viewBox } from "../../mixins/viewBox";
import { createSVGController, SVGElementController } from "./base";
import { SVGRectangleController } from "./rectangle";

export class SVGSVGController extends viewBox(
  svgChildren(createSVGController("svg", "svg-svg"))
) {
  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: "closed" });

    shadow.appendChild(this.mainElement);

    this._resizeViewBox();
  }

  get svgContainer(): SVGSVGElement | null {
    return this.mainElement;
  }
}

customElements.define("svg-svg", SVGSVGController);

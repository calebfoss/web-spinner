import { createCustomElement } from "../..";
import { viewBox } from "../../mixins/viewBox";
import { createSVGController, SVGElementController } from "./base";
import { SVGRectangleController } from "./rectangle";

export class SVGSVGController extends viewBox(
  createSVGController("svg", "svg-svg")
) {
  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: "closed" });

    shadow.appendChild(this.mainElement);

    this._resizeViewBox();
  }
  /**
   * @private
   */
  createChild<E extends SVGElementController>(
    ElementClass: E,
    options?: Options<InstanceType<E>>
  ) {
    const element = createCustomElement(ElementClass, options);

    this.appendChild(element);

    return element;
  }

  rectangle(options?: Partial<SVGRectangleController>) {
    return this.createChild(SVGRectangleController, options);
  }

  get svgContainer(): SVGSVGElement | null {
    return this.mainElement;
  }
}

customElements.define("svg-svg", SVGSVGController);

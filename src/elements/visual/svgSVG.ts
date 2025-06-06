import { svgChildren } from "../../mixins/children";
import { viewBox } from "../../mixins/viewBox";
import { createSVGController, SVGElementController } from "./svgBase";
import { SVGRectangleController } from "./rectangle";
import { Gradient } from "../../classes/gradient";

export class SVGSVGController extends viewBox(
  svgChildren(createSVGController("svg", "svg-svg"))
) {
  #defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  #gradients = new Set<SVGGradientElement>();

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: "closed" });

    shadow.appendChild(this.mainElement);

    this.mainElement.appendChild(this.#defs);

    this._resizeViewBox();
  }

  _defineGradient(gradient: Gradient) {
    if (this.#gradients.has(gradient.svg)) return gradient.svg.id;

    const padStart = 2;

    const idNumber = Array.from(this.#gradients).reduce((maxNum, gradient) => {
      const numString = gradient.id.slice(-padStart);

      const num = parseInt(numString);

      return Math.max(maxNum, num);
    }, 0);

    const gradientElement = gradient.svg;

    this.#defs.appendChild(gradientElement);

    const id = `gradient-${idNumber.toString().padStart(padStart, "0")}`;

    this.#gradients.add(gradientElement);

    gradientElement.id = id;

    return id;
  }

  download(filename = "webspinner.svg") {
    this.mainElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.mainElement.setAttribute("version", " 1.1");

    const svgString = this.mainElement.outerHTML;

    const downloadAnchor = document.createElement("a");

    downloadAnchor.download = filename;

    const blob = new Blob([svgString], { type: "image/svg" });

    const url = URL.createObjectURL(blob);

    downloadAnchor.href = url;

    downloadAnchor.click();
  }

  get svgContainer(): SVGSVGElement | null {
    return this.mainElement;
  }
}

customElements.define("svg-svg", SVGSVGController);

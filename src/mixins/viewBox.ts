import { SVGElementController } from "../elements/visual/svgBase";
import { dimensions } from "./dimensions";

export function viewBox<B extends SVGElementController>(Base: B) {
  return class extends dimensions(Base) {
    /**
     * @private
     */
    _resizeViewBox() {
      this.mainElement.setAttribute(
        "viewBox",
        `${0} ${0} ${this.width} ${this.height}`
      );
    }

    get height() {
      return super.height;
    }

    set height(value) {
      if (value === super.height) return;

      super.height = value;

      this._resizeViewBox();
    }

    get width() {
      return super.width;
    }

    set width(value) {
      if (value === super.width) return;

      super.width = value;

      this._resizeViewBox();
    }
  };
}

import { Canvas2DElement } from "../elements/canvas2d/element";
import { Canvas2DRectangle } from "../elements/canvas2d/rectangle";
import { Canvas2DShape } from "../elements/canvas2d/shape";
import { Canvas2DText } from "../elements/canvas2d/text";

export type ChildCreator<E extends Canvas2DElement> = (
  options?: Partial<E>
) => E;

export function standaloneChildren<B extends typeof Canvas2DElement>(Base: B) {
  return class extends Base {
    get line() {
      return this.createChild("ct2-line");
    }

    get rectangle(): ChildCreator<Canvas2DRectangle> {
      return this.createChild("ct2-rectangle");
    }

    get shape(): ChildCreator<Canvas2DShape> {
      return this.createChild("ct2-shape");
    }

    get text(): ChildCreator<Canvas2DText> {
      return this.createChild("ct2-text");
    }
  };
}

export function partChildren<B extends typeof Canvas2DElement>(Base: B) {
  return class extends Base {
    get line() {
      return this.createChild("ct2-shape-line");
    }

    get rectangle() {
      return this.createChild("ct2-shape-rectangle");
    }
  };
}

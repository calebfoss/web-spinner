import { Canvas2DElement } from "../elements/canvas2d/element";
import { Canvas2DRectangle } from "../elements/canvas2d/rectangle";
import { Canvas2DShape } from "../elements/canvas2d/shape";
import { Canvas2DText } from "../elements/canvas2d/text";

export type ChildCreator<E extends Canvas2DElement> = (
  options?: Partial<E>
) => E;

export function standaloneChildren<B extends typeof Canvas2DElement>(Base: B) {
  return class extends Base {
    get ellipse() {
      return this.createChild("c2d-ellipse");
    }

    get line() {
      return this.createChild("c2d-line");
    }

    get rectangle(): ChildCreator<Canvas2DRectangle> {
      return this.createChild("c2d-rectangle");
    }

    get shape(): ChildCreator<Canvas2DShape> {
      return this.createChild("c2d-shape");
    }

    get text(): ChildCreator<Canvas2DText> {
      return this.createChild("c2d-text");
    }
  };
}

export function partChildren<B extends typeof Canvas2DElement>(Base: B) {
  return class extends Base {
    get ellipse() {
      return this.createChild("c2d-shape-ellipse");
    }

    get line() {
      return this.createChild("c2d-shape-line");
    }

    get rectangle() {
      return this.createChild("c2d-shape-rectangle");
    }
  };
}

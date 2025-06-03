import { createCustomElement } from "../elements/mixable";
import { Canvas2DBezier, Canvas2DShapeBezier } from "../elements/bezier";
import { C2DBase } from "../elements/c2dBase";
import { Canvas2DEllipse, Canvas2DShapeEllipse } from "../elements/ellipse";
import { Canvas2DImage } from "../elements/image";
import { Canvas2DLine, Canvas2DShapeLine } from "../elements/line";
import {
  Canvas2DRectangle,
  Canvas2DShapeRectangle,
} from "../elements/rectangle";
import { Canvas2DShape } from "../elements/shape";
import { Canvas2DText } from "../elements/text";
import { Canvas2DVideo } from "../elements/video";
import { SVGElementController } from "../elements/svgBase";
import { SVGRectangleController } from "../elements/rectangle";
import {
  HTMLElementController,
  HTMLElementWrapperConstructor,
} from "../elements/document/domBase";
import {
  DocumentContainerController,
  DocumentContainerWrapper,
} from "../elements/document/container";
import {
  DocumentParagraphController,
  DocumentParagraphWrapper,
} from "../elements/document/paragraph";

type MultipleCallback = (index: number) => Node | undefined;

export function c2dStandaloneChildren<B extends typeof C2DBase>(Base: B) {
  return class extends Base {
    /**
     * Creates a `<c2d-bezier>` child element and returns it.
     */
    bezier(options?: Options<Canvas2DBezier>): Canvas2DBezier {
      return this.createChild(Canvas2DBezier, options);
    }

    /**
     * Creates a `<c2d-ellipse>` child element and returns it.
     */
    ellipse(options?: Options<Canvas2DEllipse>): Canvas2DEllipse {
      return this.createChild(Canvas2DEllipse, options);
    }

    /**
     * Creates a `<c2d-image>` child element and returns it.
     */
    image(options?: Options<Canvas2DImage>): Canvas2DImage {
      return this.createChild(Canvas2DImage, options);
    }

    multiple(callback: MultipleCallback): Node[];
    multiple(count: number, callback: (index: number) => Node): Node[];
    multiple<
      A1 extends number | MultipleCallback,
      A2 extends A1 extends number ? (index: number) => Node : undefined
    >(arg1: A1, arg2?: A2): Node[] {
      if (typeof arg1 === "number") {
        if (arg2 === undefined) throw new Error("Missing callback");

        return new Array(arg1).fill(0).map((_, index) => {
          const child = arg2(index);

          this.appendChild(child);

          return child;
        });
      }

      const recurseChildren = (children: Node[], index: number) => {
        const child = arg1(index);

        if (child === undefined) return children;

        this.appendChild(child);

        return recurseChildren(children.concat(child), index + 1);
      };

      return recurseChildren([], 0);
    }

    /**
     * Creates a `<c2d-line>` child element and returns it.
     */
    line(options?: Options<Canvas2DLine>): Canvas2DLine {
      return this.createChild(Canvas2DLine, options);
    }

    /**
     * Creates a `<c2d-rectangle>` child element and returns it.
     */
    rectangle(options?: Options<Canvas2DRectangle>): Canvas2DRectangle {
      return this.createChild(Canvas2DRectangle, options);
    }

    /**
     * Creates a `<c2d-shape>` child element and returns it.
     */
    shape(options?: Options<Canvas2DShape>): Canvas2DShape {
      return this.createChild(Canvas2DShape, options);
    }

    /**
     * Creates a `<c2d-text>` child element and returns it.
     */
    text(options?: Options<Canvas2DText>): Canvas2DText {
      return this.createChild(Canvas2DText, options);
    }

    /**
     * Creates a `<c2d-video>` child element and returns it.
     */
    video(options?: Options<Canvas2DVideo>): Canvas2DVideo {
      return this.createChild(Canvas2DVideo, options);
    }
  };
}

export function c2dShapeChildren<B extends typeof C2DBase>(Base: B) {
  return class extends Base {
    bezier(options?: Options<Canvas2DShapeBezier>) {
      return this.createChild(Canvas2DShapeBezier, options);
    }

    ellipse(options?: Options<Canvas2DShapeEllipse>) {
      return this.createChild(Canvas2DShapeEllipse, options);
    }

    line(options?: Options<Canvas2DShapeLine>) {
      return this.createChild(Canvas2DShapeLine, options);
    }

    rectangle(options?: Options<Canvas2DShapeRectangle>) {
      return this.createChild(Canvas2DShapeRectangle, options);
    }
  };
}

export function svgChildren<B extends SVGElementController>(Base: B) {
  return class extends Base {
    /**
     * @private
     */
    createSVGControllerChild<E extends SVGElementController>(
      ElementClass: E,
      options?: Options<InstanceType<E>>
    ) {
      const element = createCustomElement(ElementClass, options);

      this.appendChild(element);

      return element;
    }

    rectangle(options?: Partial<SVGRectangleController>) {
      return this.createSVGControllerChild(SVGRectangleController, options);
    }
  };
}

export function documentChildren<
  T extends keyof HTMLElementTagNameMap,
  W extends HTMLElementWrapperConstructor<T>
>(WrapperConstructor: W) {
  return class extends WrapperConstructor {
    container(
      options?: Options<DocumentContainerController>
    ): DocumentContainerController {
      return this.createWrappedChild(DocumentContainerWrapper, options);
    }

    paragraph(
      options?: Options<DocumentParagraphController>
    ): DocumentParagraphController {
      return this.createWrappedChild(DocumentParagraphWrapper, options);
    }
  };
}

import {
  Canvas2DBezier,
  Canvas2DShapeBezier,
} from "../elements/canvas2d/bezier";
import { Canvas2DElement } from "../elements/canvas2d/element";
import {
  Canvas2DEllipse,
  Canvas2DShapeEllipse,
} from "../elements/canvas2d/ellipse";
import { Canvas2DImage } from "../elements/canvas2d/image";
import { Canvas2DLine, Canvas2DShapeLine } from "../elements/canvas2d/line";
import {
  Canvas2DRectangle,
  Canvas2DShapeRectangle,
} from "../elements/canvas2d/rectangle";
import { Canvas2DShape } from "../elements/canvas2d/shape";
import { Canvas2DText } from "../elements/canvas2d/text";
import { Canvas2DVideo } from "../elements/canvas2d/video";

export function standaloneChildren<B extends typeof Canvas2DElement>(Base: B) {
  return class extends Base {
    /**
     * Creates a `<c2d-bezier>` child element and returns it.
     */
    bezier(options?: Options<Canvas2DBezier>): Canvas2DBezier {
      return this.createChild(Canvas2DBezier, options);
    }

    ellipse(options?: Options<Canvas2DEllipse>): Canvas2DEllipse {
      return this.createChild(Canvas2DEllipse, options);
    }

    image(options?: Options<Canvas2DImage>): Canvas2DImage {
      return this.createChild(Canvas2DImage, options);
    }

    line(options?: Options<Canvas2DLine>): Canvas2DLine {
      return this.createChild(Canvas2DLine, options);
    }

    rectangle(options?: Options<Canvas2DRectangle>): Canvas2DRectangle {
      return this.createChild(Canvas2DRectangle, options);
    }

    shape(options?: Options<Canvas2DShape>): Canvas2DShape {
      return this.createChild(Canvas2DShape, options);
    }

    text(options?: Options<Canvas2DText>): Canvas2DText {
      return this.createChild(Canvas2DText, options);
    }

    video(options?: Options<Canvas2DVideo>): Canvas2DVideo {
      return this.createChild(Canvas2DVideo, options);
    }
  };
}

export function partChildren<B extends typeof Canvas2DElement>(Base: B) {
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

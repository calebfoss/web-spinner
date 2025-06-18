import { Angle } from "../classes/angle";
import { Vector2D, Vector2DBase } from "../classes/vector2d";
import { Canvas2DCanvasElement } from "../elements/visual/canvas";
import {
  Canvas2DBaseRenderable,
  Canvas2DShapePartRenderable,
  Canvas2DStandaloneRenderable,
} from "../elements/visual/renderable";
import { CustomHTMLElement } from "../elements/mixable";
import { SVGElementController } from "../elements/visual/svgBase";
import { attributeParser } from "../utlities/attributeParser";
import { isReadOnly } from "../utlities/readOnly";

export function baseTransform<B extends typeof CustomHTMLElement>(Base: B) {
  return class BaseTransform extends Base {
    static observedAttributes: string[] = [
      ...Base.observedAttributes,
      "angle",
      "angular-velocity",
      "anchor",
      "scale",
      "velocity",
    ];

    #anchor = Vector2D.zero;
    #angle = Angle.radians(0);
    #angularVelocity = Angle.radians(0);
    #scale = Vector2D.one;
    #velocity = Vector2D.zero;

    constructor(...args: any[]) {
      super(...args);

      this.#anchor.addChangeListener(this.#anchorChangeListener);

      this.#angle.addChangeListener(this.#angleChangeListener);
    }

    #angleChangeListener: ChangeListener<number> = () => {
      this.registerChange("angle", this.#angle);
    };

    /**
     * Clockwise rotation of the element around its anchor.
     *
     * @attr
     * @reflect
     */
    get angle(): Angle {
      return this.#angle;
    }

    set angle(value) {
      const replace = this.#angle.replace.bind(this.#angle);

      replace((this.#angle = value), this.#angleChangeListener);
    }

    #angularVelocityChangedTime = -1;
    /**
     * Clockwise rotation per second.
     *
     * @attr angular-velocity
     * @reflect
     */
    get angularVelocity(): Angle {
      return this.#angularVelocity;
    }

    set angularVelocity(value) {
      if (this.#angularVelocity.equals(value)) {
        return;
      }

      this.#angularVelocityChangedTime = performance.now();

      this.registerChange("angularVelocity", (this.#angularVelocity = value));
    }

    /**
     * Base position of the element relative to its parent's anchor.
     *
     * @attr
     * @reflect
     */
    get anchor(): Vector2D {
      return this.#anchor;
    }

    #anchorChangeListener: ChangeListener<Vector2DBase> = () => {
      this.registerChange("anchor", this.#anchor);
    };

    set anchor(value) {
      const replace = this.#anchor.replace.bind(this.#anchor);

      replace((this.#anchor = value), this.#anchorChangeListener);
    }

    _applyMovement(deltaTime: number) {
      const now = performance.now();

      if (this.#angularVelocity.radians !== 0) {
        const angleChange =
          (this.#angularVelocity[this.#angle.unit] *
            Math.min(deltaTime, now - this.#angularVelocityChangedTime)) /
          1000;

        this.angle[this.#angle.unit] += angleChange;
      }

      if (this.#velocity.x !== 0 || this.#velocity.y !== 0) {
        const velocityDelta =
          Math.min(deltaTime, now - this.#velocityChangedTime) / 1000;

        if (isReadOnly(this.#anchor, "x") || isReadOnly(this.#anchor, "y"))
          this.#anchor = this.#anchor.copy();

        this.moveAnchor(
          this.#velocity.x * velocityDelta,
          this.#velocity.y * velocityDelta
        );
      }
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (newValue !== null) {
        switch (name) {
          case "angle":
            if (newValue === this.angle.toString()) return;
            this.angle = attributeParser.Angle(newValue);
            break;
          case "angular-velocity":
            if (newValue === this.angularVelocity.toString()) return;
            this.angularVelocity = attributeParser.Angle(newValue);
            break;
          case "anchor":
            const newAnchor = attributeParser.Vector2D(newValue);
            if (!this.#anchor.equals(newAnchor)) this.anchor = newAnchor;
            break;
          case "scale":
            const newScale = attributeParser.Vector2D(newValue);
            if (!this.#scale.equals(newScale)) this.scale = newScale;
            break;
          case "velocity":
            this.velocity = attributeParser.Vector2D(newValue);
            break;
        }
      }

      super.attributeChangedCallback(name, oldValue, newValue);
    }

    moveAnchor(x: number, y: number) {
      if (x === 0 && y === 0) return;

      this.#anchor.x += x;
      this.#anchor.y += y;
    }

    /**
     * @param angle - Angle to turn the element in the clockwise direction.
     */
    rotateClockwise(angle: Angle) {
      this.angle = Angle.radians(this.#angle.radians + angle.radians);
    }

    /**
     * @param angle - Angle to turn the element in the counterclockwise direction.
     */
    rotateCounterclockwise(angle: Angle) {
      this.angle = Angle.radians(this.#angle.radians - angle.radians);
    }

    /**
     * Multiplies the size of the element in the x and y direction. This also affects
     * line width. Setting scale to a number will set both the x and y scale to that
     * value.
     *
     * @attr
     * @reflect
     */
    get scale(): Vector2D {
      return this.#scale;
    }

    set scale(value: Vector2D | number) {
      if (typeof value === "number") {
        const vectorValue = new Vector2D(value);

        if (this.#scale.equals(vectorValue)) return;

        this.registerChange("scale", (this.#scale = vectorValue));
      } else if (this.#scale.equals(value)) {
        return;
      } else {
        this.registerChange("scale", (this.#scale = value));
      }
    }

    #velocityChangedTime = -1;

    /**
     * Anchor movement per second.
     *
     * @attr
     * @reflect
     */
    get velocity(): Vector2D {
      return this.#velocity;
    }

    set velocity(value) {
      if (this.#velocity.equals(value)) return;

      this.registerChange("velocity", (this.#velocity = value));

      this.#velocityChangedTime = performance.now();
    }
  };
}

function c2dTransform<
  B extends ReturnType<typeof baseTransform<typeof Canvas2DBaseRenderable>>
>(Base: B) {
  return class C2DTransform extends Base {
    render(canvas2D: Canvas2DCanvasElement): void {
      super.render(canvas2D);

      const { context } = canvas2D;

      context.translate(this.anchor.x, this.anchor.y);
      context.rotate(this.angle.radians);
      context.scale(this.scale.x, this.scale.y);
    }

    afterRender(canvas2D: Canvas2DCanvasElement): void {
      super.afterRender(canvas2D);

      this._applyMovement(canvas2D.deltaTime);
    }
  };
}

export type C2DTransformed = ReturnType<typeof c2dTransform>;

export class C2DStandaloneTransformed extends c2dTransform(
  baseTransform(Canvas2DStandaloneRenderable)
) {}

export class C2DShapePartTransformed extends c2dTransform(
  baseTransform(Canvas2DShapePartRenderable)
) {}

export function svgTransform<B extends SVGElementController>(Base: B) {
  return class SVGControllerTransform extends baseTransform(Base) {
    get anchor() {
      return super.anchor;
    }

    set anchor(value) {
      const change = !super.anchor.equals(value);

      super.anchor = value;

      if (change) this.#updateTransformAttribute();
    }

    #angleChangeListener = () => {
      this.#updateTransformAttribute();
    };

    get angle() {
      return super.angle;
    }

    set angle(value) {
      const change = !super.angle.equals(value);

      super.angle = value;

      super.angle.addChangeListener(this.#angleChangeListener);

      if (change) this.#updateTransformAttribute();
    }

    connectedCallback(): void {
      super.connectedCallback();

      this.#updateTransformAttribute();
    }

    #updateTransformAttribute() {
      const transform = new DOMMatrix()
        .translateSelf(this.anchor.x, this.anchor.y)
        .rotateSelf(this.angle.degrees)
        .scaleSelf(this.scale.x, this.scale.y);

      if (transform.isIdentity) return;

      const { a, b, c, d, e, f } = transform;

      this._setStyleAttribute(
        "transform",
        `matrix(${a} ${b} ${c} ${d} ${e} ${f})`
      );
    }
  };
}

import { Canvas2DRenderable } from "../elements/canvas2d/renderable";
import { attributeParser } from "../utlities/attributeParser";
import { Angle } from "./angle";
import { Units } from "./units";

export const fontSizeUnits = {
  ...Units.size,
  capHeight: "cap",
  characterWidth: "ch",
  calculated: "em",
  xHeight: "ex",
  characterHeight: "ic",
  lineHeight: "lh",
  rootCapHeight: "rcap",
  rootCharacterWidth: "rch",
  rootSize: "rem",
  rootXHeight: "rex",
  rootCharacterHeight: "ic",
  rootLineHeight: "rlh",
} as const;

const fontStyles = {
  normal: "normal",
  italic: "italic",
  oblique: "oblique",
} as const;

export function useFont<B extends typeof Canvas2DRenderable>(Base: B) {
  type FontClass = typeof Font;

  type FontStyle =
    | FontClass["style"][keyof FontClass["style"]]
    | `oblique ${number}${(typeof Angle)["unit"][keyof (typeof Angle)["unit"]]}`;

  type FontSizeUnit = (typeof fontSizeUnits)[keyof typeof fontSizeUnits];

  class Font extends Base {
    static observedAttributes = [
      ...Base.observedAttributes,
      "size",
      "stretch",
      "font-family",
    ];

    #fontFamily: string | null = null;
    #size: number | null = null;
    #sizeUnit: FontSizeUnit = "px";
    #stretch: CanvasFontStretch | null = null;
    #fontStyle: FontStyle | null = null;

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (newValue === null)
        return super.attributeChangedCallback(name, oldValue, newValue);

      switch (name) {
        case "size":
          this.size = attributeParser.number(newValue);
          return;
        case "stretch":
          this.stretch = newValue as CanvasFontStretch;
          return;
        case "font-family":
          this.fontFamily = newValue;
          return;
        default:
          super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    static sizeUnit = fontSizeUnits;

    static stretch: { [key: string]: CanvasFontStretch } = {
      normal: "normal",
      ultraCondensed: "ultra-condensed",
      extraCondensed: "extra-condensed",
      condensed: "condensed",
      expanded: "expanded",
      extraExpanded: "extra-expanded",
      ultraExpanded: "ultra-expanded",
    };

    static style = fontStyles;

    get fontFamily() {
      return this.#fontFamily;
    }

    set fontFamily(value) {
      if (this.#fontFamily === value) return;

      this.registerChange("fontFamily", (this.#fontFamily = value));
    }

    render(context: CanvasRenderingContext2D, frame: number): void {
      if (this.#fontFamily === null) {
        if (this.#size !== null) {
          const fontFamlyMatch = context.font.match(/\S*$/);

          if (fontFamlyMatch === null)
            throw new Error(
              `Failed to parse family in current font: ${context.font}`
            );

          const [fontFamily] = fontFamlyMatch;

          context.font = `${this.#size}${this.#sizeUnit} ${fontFamily}`;
        }
      } else if (this.#size === null) {
        const fontSizeMatch = context.font.match(/(\S)*\s\S*$/);

        if (fontSizeMatch === null || fontSizeMatch[0].length < 2)
          throw new Error(
            `Failed to parse size in current font: ${context.font}`
          );

        const fontSize = fontSizeMatch[1];

        context.font = `${fontSize} ${this.#fontFamily}`;
      } else {
        context.font = `${this.#size}${this.#sizeUnit} ${this.#fontFamily}`;
      }

      if (this.#stretch !== null) context.fontStretch = this.#stretch;

      super.render(context, frame);
    }

    get size() {
      return this.#size;
    }

    set size(value) {
      if (this.#size === value) return;

      this.registerChange("size", (this.#size = value));
    }

    get sizeUnit() {
      return this.#sizeUnit;
    }

    set sizeUnit(value) {
      if (this.#sizeUnit === value) return;

      this.registerChange("sizeUnit", (this.#sizeUnit = value));
    }

    get sizeString() {
      return this.#size?.toString() ?? "";
    }

    get stretch() {
      return this.#stretch;
    }

    set stretch(value) {
      if (this.#stretch === value) return;

      this.registerChange("stretch", (this.#stretch = value));
    }

    get fontStyle() {
      return this.#fontStyle;
    }
  }

  return Font;
}

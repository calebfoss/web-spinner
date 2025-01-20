import { Angle } from "./angle";
import { Units } from "./units";

type FontClass = typeof Font;

type FontSizeClass = typeof FontSize;

export type FontSizeUnit = FontSizeClass["unit"][keyof FontSizeClass["unit"]];

type FontStretch =
  | FontClass["stretch"][keyof FontClass["stretch"]]
  | `${number}%`;

export type FontStyle =
  | FontClass["style"][keyof FontClass["style"]]
  | `oblique ${number}${(typeof Angle)["unit"][keyof (typeof Angle)["unit"]]}`;

export class FontSize {
  #value: number;
  #unit: FontSizeUnit;

  static unit = {
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
  };

  constructor(value: number, unit: FontSizeUnit) {
    this.#value = value;
    this.#unit = unit;
  }

  toString() {
    return `${this.#value}${this.#unit}`;
  }

  get unit() {
    return this.#unit;
  }

  set unit(value) {
    this.#unit = value;
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
  }
}

export class Font {
  #family: string | null = null;
  #size: FontSize | null = null;
  #stretch: FontStretch | null = null;
  #style: FontStyle | null = null;

  constructor(options?: Partial<Font>) {
    Object.assign(this, options);
  }

  static stretch = {
    normal: "normal",
    ultraCondensed: "ultra-condensed",
    extraCondensed: "extra-condensed",
    condensed: "condensed",
    expanded: "expanded",
    extraExpanded: "extra-expanded",
    ultraExpanded: "ultra-expanded",
  };

  static style = { normal: "normal", italic: "italic", oblique: "oblique" };

  toString() {
    return `${this.family} ${this.sizeString} ${this.stretch} ${this.style}`;
  }

  get family() {
    return this.#family ?? "";
  }

  set family(value) {
    this.#family = value;
  }

  get size() {
    return this.#size;
  }

  get sizeString() {
    return this.#size?.toString() ?? "";
  }

  set size(value) {
    this.#size = value;
  }

  get stretch() {
    return this.#stretch ?? "";
  }

  set stretch(value: FontStretch | number) {
    this.#stretch = typeof value === "number" ? `${value}%` : value;
  }

  get style() {
    return this.#style ?? "";
  }

  set style(value: FontStyle) {
    this.#style = value;
  }
}

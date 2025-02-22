type None = "none";

type Updater = (frame: number) => void;

type CSSLengthUnit =
  | "cm"
  | "mm"
  | "Q"
  | "in"
  | "pc"
  | "pt"
  | "px"
  | "em"
  | "vh"
  | "vw";

type TypedEventListener<E extends keyof HTMLElementEventMap> = (
  event: HTMLElementEventMap[E]
) => void;

type ChangeListener<T> = (newValue: T) => void;

type Writeable<T> = {
  -readonly [Key in keyof T]: T[Key];
};

type Options<T> = Partial<Writeable<T>>;

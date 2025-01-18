function hex(n: number) {
  return Math.max(Math.min(n, 255), 0).toString(16).padStart(2, "0");
}

class Color {
  #hex: string;

  constructor(gray: number, alpha?: number);
  constructor(red: number, green: number, blue: number, alpha?: number);
  constructor(
    firstArg: number,
    secondArg?: number,
    blue?: number,
    alpha?: number
  ) {
    if (arguments.length < 3) {
      const grayNum = firstArg;
      const grayHex = hex(grayNum);

      const alphaNum = secondArg;
      const alphaHex = alphaNum === undefined ? "" : hex(alphaNum);

      this.#hex = `#${grayHex}${grayHex}${grayHex}${alphaHex}`;
    } else {
      const red = firstArg;
      const redHex = hex(red);

      const green = secondArg;
      const greenHex = hex(green as number);

      const blueHex = hex(blue as number);

      const alphaHex = alpha === undefined ? "" : hex(alpha);

      this.#hex = `#${redHex}${greenHex}${blueHex}${alphaHex}`;
    }
  }

  static gray(value: number, alpha?: number) {
    return new Color(value, alpha);
  }

  get hex() {
    return this.#hex;
  }

  static rgb(red: number, green: number, blue: number, alpha?: number) {
    return new Color(red, green, blue, alpha);
  }
}

class Vector2D {
  #x: number;
  #y: number;

  constructor(x = 0, y = 0) {
    this.#x = x;
    this.#y = y;
  }

  static get one() {
    return new Vector2D(1, 1);
  }

  static xy(x: number, y: number) {
    return new Vector2D(x, y);
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    this.#x = value;
  }

  get y() {
    return this.#y;
  }

  set y(value) {
    this.#y = value;
  }

  static get zero() {
    return new Vector2D();
  }
}

type AngleUnit = "degrees" | "radians";

class Angle {
  #degrees: number | null = null;
  #radians: number | null = null;

  constructor(unit: AngleUnit, value: number) {
    if (unit === "degrees") this.#degrees = value;
    else this.#radians = value;
  }

  static degrees(value: number) {
    return new Angle("degrees", value);
  }

  get degrees() {
    if (this.#degrees !== null) return this.#degrees;

    if (this.#radians === null) throw new Error("Angle missing value");

    this.#degrees = this.#radians * (180 / Math.PI);

    return this.#degrees;
  }

  set degrees(value) {
    this.#degrees = value;

    if (this.#radians === null) return;

    this.#radians = value * (Math.PI / 180);
  }

  static radians(value: number) {
    return new Angle("radians", value);
  }

  get radians() {
    if (this.#radians !== null) return this.#radians;

    if (this.#degrees === null) throw new Error("Angle missing value");

    this.#radians = this.#degrees * (Math.PI / 180);

    return this.#radians;
  }

  set radians(value) {
    this.#radians = value;

    if (this.#degrees === null) return;

    this.#degrees = value * (180 / Math.PI);
  }
}

const NONE = "none";

type None = typeof NONE;

type Canvas2DElementTagMap = {
  ["z-canvas"]: Canvas2DCanvasElement;
  ["z-rectangle"]: CanvasRectangle;
};

function range(stop: number): IterableIterator<number>;
function range(start: number, stop: number): IterableIterator<number>;
function range(arg1: number, arg2?: number): IterableIterator<number> {
  const [start, stop] = arg2 === undefined ? [0, arg1] : [arg1, arg2];

  const step = stop > start ? 1 : -1;

  let value = start;

  function next(): IteratorResult<number> {
    const result = {
      value,
      done: start + step === stop,
    };

    value += step;

    return result;
  }

  return {
    [Symbol.iterator]() {
      return this;
    },
    next,
  };
}

function multiple<R extends Node>(
  count: number,
  generator: (index: number) => R
) {
  return new Array(count).fill(0).map((_, index) => generator(index));
}

type Updater = (frame: number) => void;

class Canvas2DElement extends HTMLElement {
  #everyFrame: Updater | null = null;

  protected createChild<T extends keyof Canvas2DElementTagMap>(tag: T) {
    const element = document.createElement(tag) as Canvas2DElementTagMap[T];

    this.appendChild(element);

    return function (options?: Partial<typeof element>) {
      Object.assign(element, options);

      return element;
    };
  }

  get everyFrame() {
    return this.#everyFrame;
  }

  set everyFrame(updater) {
    this.#everyFrame = updater;
  }

  get rectangle() {
    return this.createChild("z-rectangle");
  }
}

class Canvas2DCanvasElement extends Canvas2DElement {
  #animating = false;
  #background: Color | None = "none";
  #context: CanvasRenderingContext2D;
  #frame = 0;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    const canvas = document.createElement("canvas");

    shadowRoot.appendChild(canvas);

    const context = canvas.getContext("2d");

    if (context === null) throw new Error("Null context");

    this.#context = context;
  }

  get background() {
    return this.#background;
  }

  set background(color) {
    this.#background = color;
  }

  connectedCallback() {
    this.canvas.style.scale = `${1 / devicePixelRatio}`;
  }

  get canvas() {
    return this.#context.canvas;
  }

  get context() {
    return this.#context;
  }

  get everyFrame() {
    return super.everyFrame;
  }

  set everyFrame(updater: Updater | null) {
    super.everyFrame = updater;

    if (updater === null) return;

    this.#animating = true;

    this.render();
  }

  get width() {
    return this.canvas.width / devicePixelRatio;
  }

  set width(value) {
    this.canvas.width = value * devicePixelRatio;
  }

  get height() {
    return this.canvas.width / devicePixelRatio;
  }

  set height(value) {
    this.canvas.height = value * devicePixelRatio;
  }

  render() {
    this.#frame++;

    const context = this.#context;

    context.save();

    this.everyFrame?.(this.#frame);

    context.scale(devicePixelRatio, devicePixelRatio);

    if (this.#background !== "none") {
      context.save();

      context.fillStyle = this.#background.hex;

      context.fillRect(0, 0, this.width, this.height);

      context.restore();
    }

    for (const child of this.children) {
      if (child instanceof Canvas2DRenderable) {
        child.render(context, this.#frame);
      }
    }

    context.restore();

    if (this.#animating) requestAnimationFrame(this.render.bind(this));
  }
}

customElements.define("z-canvas", Canvas2DCanvasElement);

function createCanvas(options?: Partial<Canvas2DCanvasElement>) {
  const element = document.createElement("z-canvas") as Canvas2DCanvasElement;

  Object.assign(element, options);

  return element;
}

class Canvas2DRenderable extends Canvas2DElement {
  constructor(...args: any[]) {
    super();
  }

  render(context: CanvasRenderingContext2D, frame: number) {
    context.save();
    context.beginPath();
    this.everyFrame?.(frame);
  }

  afterRender(context: CanvasRenderingContext2D, frame: number) {
    for (const child of this.children) {
      if (child instanceof Canvas2DRenderable) child.render(context, frame);
    }

    context.restore();
  }
}

function transformeable<B extends typeof Canvas2DRenderable>(Base: B) {
  return class Transformed extends Base {
    #anchor = new Vector2D(0, 0);
    #angle: Angle = Angle.radians(0);
    #position = new Vector2D(0, 0);

    get angle() {
      return this.#angle;
    }

    set angle(value) {
      this.#angle = value;
    }

    get anchor() {
      return this.#anchor;
    }

    set anchor(vector) {
      this.#anchor = vector;
    }

    moveAnchor(x: number, y: number) {
      this.#anchor.x += x;
      this.#anchor.y += y;
    }

    movePosition(x: number, y: number) {
      this.#position.x += x;
      this.#position.y += y;
    }

    get position() {
      return this.#position;
    }

    set position(vector) {
      this.#position = vector;
    }

    render(context: CanvasRenderingContext2D, frame: number): void {
      super.render(context, frame);

      context.translate(this.#anchor.x, this.#anchor.y);
      context.rotate(this.#angle.radians);
    }

    rotateClockwise(angle: Angle) {
      this.#angle = Angle.radians(this.#angle.radians + angle.radians);
    }

    rotateCounterclockwise(angle: Angle) {
      this.#angle = Angle.radians(this.#angle.radians - angle.radians);
    }
  };
}

function fillable<B extends typeof Canvas2DRenderable>(Base: B) {
  return class Fillable extends Base {
    #fill: Color | None = new Color(32);

    get fill() {
      return this.#fill;
    }

    set fill(style) {
      this.#fill = style;
    }

    render(context: CanvasRenderingContext2D, frame: number): void {
      super.render(context, frame);

      if (this.#fill !== "none") context.fillStyle = this.#fill.hex;
    }

    afterRender(context: CanvasRenderingContext2D, frame: number): void {
      if (this.#fill !== "none") context.fill();

      super.afterRender(context, frame);
    }
  };
}

function strokeable<B extends typeof Canvas2DRenderable>(Base: B) {
  return class Strokeable extends Base {
    #stroke: Color | None = new Color(200);
    #width = 1;

    get stroke() {
      return this.#stroke;
    }

    set stroke(style) {
      this.#stroke = style;
    }

    render(context: CanvasRenderingContext2D, frame: number): void {
      super.render(context, frame);

      if (this.#stroke !== "none") context.strokeStyle = this.#stroke.hex;
    }

    afterRender(context: CanvasRenderingContext2D, frame: number): void {
      if (this.#stroke !== "none") context.stroke();

      super.afterRender(context, frame);
    }
  };
}

class CanvasRectangle extends strokeable(
  fillable(transformeable(Canvas2DRenderable))
) {
  #width = 100;
  #height = 100;

  get width() {
    return this.#width;
  }

  set width(value) {
    this.#width = value;
  }

  get height() {
    return this.#height;
  }

  set height(value) {
    this.#height = value;
  }

  render(context: CanvasRenderingContext2D, frame: number): void {
    super.render(context, frame);

    const {
      position: { x, y },
      width,
      height,
    } = this;

    context.rect(x, y, width, height);

    this.afterRender(context, frame);
  }
}

customElements.define("z-rectangle", CanvasRectangle);

const canvas = createCanvas({
  width: 500,
  height: 500,
  background: Color.gray(128),
});

document.body.appendChild(canvas);

const rectangle1 = canvas.rectangle();

const rectangle2 = canvas.rectangle({
  anchor: Vector2D.xy(100, 100),
  fill: Color.gray(200),
  stroke: Color.gray(32),
});

const rectangles = multiple(20, (index) =>
  rectangle1.rectangle({
    angle: Angle.degrees(index * 30),
    anchor: Vector2D.xy(50 + index * 20, 50 + index * 20),
    position: Vector2D.xy(-50, -50),
    fill: Color.rgb(index * 16, index * 8, index * 24),
  })
);

canvas.everyFrame = (frame) => {
  rectangle1.moveAnchor(1, 0);

  for (const rectChild of rectangles) {
    rectChild.rotateClockwise(Angle.degrees(1));
  }
};

canvas.addEventListener("click", () => {
  rectangle2.movePosition(0, 25);
});

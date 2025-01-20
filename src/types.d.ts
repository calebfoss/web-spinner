type AngleUnit = "degrees" | "radians";

type None = "none";

type Canvas2DElementTagMap = {
  ["z-canvas"]: Canvas2DCanvasElement;
  ["z-rectangle"]: CanvasRectangle;
};

type Updater = (frame: number) => void;

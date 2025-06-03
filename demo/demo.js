import {
  createRoot,
  Color,
  Vector2D,
  Angle,
  createState,
  ConicalGradient,
  LinearGradient,
  RadialGradient,
  Shadow,
} from "web-spinner";

const angle = Angle.degrees(0);

const root = createRoot();

const paragraph = root.paragraph()`The current angle is ${angle} degrees`;

root.addEventListener("click", () => {
  angle.degrees += 15;
});

const svg = root.svg({ width: 100, height: 100 });

const gradient = new RadialGradient(0.5, 0.5, 0, 0.5, 0.5, 0.5);

gradient.addColorStop(0, Color.rgb(255, 0, 0));

gradient.addColorStop(1, Color.rgb(0, 0, 255));

const parentRect = svg.rectangle({
  width: 50,
  height: 50,
  fill: Color.hsl(240, 80, 75),
});

const childRect = parentRect.rectangle({
  anchor: Vector2D.xy(50, 25),
  angle,
  scale: Vector2D.xy(0.5, 1),
  width: 25,
  height: 25,
  stroke: gradient,
  fill: "black",
  origin: "center",
});

childRect.addEventListener("click", () => {
  childRect.moveOffset(10, 0);
});

svg.rectangle({ fill: "pink", width: 20, height: 20 });

root.canvas2D({ width: 50, height: 50, background: "yellow" });

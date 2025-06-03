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

const root = createRoot();

root.paragraph({
  style: { color: "red", backgroundColor: "black" },
})`Hello world!`;

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
  angle: Angle.degrees(45),
  scale: Vector2D.xy(0.5, 1),
  width: 25,
  height: 25,
  stroke: gradient,
  fill: "black",
});

childRect.addEventListener("click", () => {
  childRect.moveOffset(10, 0);
});

svg.rectangle({ fill: "pink", width: 20, height: 20 });

root.canvas2D({ width: 50, height: 50, background: "yellow" });

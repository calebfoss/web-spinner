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

const video = root.video({
  src: "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4",
  controls: true,
});

const audio = root.audio({
  src: "https://dn721601.ca.archive.org/0/items/78_a-visit-to-the-insect-zoo_the-louis-voss-grand-orchestra-h-bick_gbia3027479a/A%20VISIT%20TO%20THE%20INSECT%20ZOO%20-%20THE%20LOUIS%20VOSS%20GRAND%20ORCHESTRA.mp3",
  controls: true,
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

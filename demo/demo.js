import {
  createCanvas,
  Color,
  Vector2D,
  Angle,
  createState,
  ConicalGradient,
  LinearGradient,
  RadialGradient,
  Shadow,
  createSVG,
} from "web-spinner";

const svg = createSVG({ width: 100, height: 100 });

const parentRect = svg.rectangle({
  width: 50,
  height: 50,
  fill: Color.hsl(240, 80, 75),
});

const childRect = parentRect.rectangle({
  offset: Vector2D.xy(50, 25),
  width: 25,
  height: 25,
  stroke: "black",
  lineWidth: 10,
});

childRect.addEventListener("click", () => {
  childRect.moveOffset(10, 0);
});

document.body.appendChild(svg);

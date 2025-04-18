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

svg.rectangle({ width: 50, height: 50 });

document.body.appendChild(svg);

import {
  createCanvas,
  Color,
  Vector2D,
  Angle,
  createState,
  ConicalGradient,
  LinearGradient,
  RadialGradient,
} from "webSpinner";

const canvas = createCanvas({
  width: 500,
  height: 500,
  background: Color.rgb(93, 172, 92),
});

const gradient = new LinearGradient()
  .addColorStop(0, Color.rgb(64, 67, 226))
  .addColorStop(1, Color.rgb(72, 23, 100));

const rotatingSquare = canvas.rectangle({
  anchor: canvas.center,
  origin: "center",
  fill: gradient,
  width: 200,
  height: 200,
});

rotatingSquare.listen.click(() => {
  rotatingSquare.rotateClockwise(Angle.degrees(10));
});

document.body.appendChild(canvas);

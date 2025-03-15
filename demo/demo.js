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
} from "web-spinner";

const canvas = createCanvas({
  width: 500,
  height: 500,
  background: Color.hsl(93, 50, 60),
});

const shadow = new Shadow({ offset: canvas.mouse, blur: 10 });

canvas.multiple(10, (index) => {
  const circle = canvas.ellipse({
    anchor: Vector2D.xy(index * 50, Math.random() * canvas.height),
    fill: Color.rgb(
      Math.random() * 128 + 128,
      Math.random() * 128 + 128,
      Math.random() * 128 + 128
    ),
    stroke: "none",
    shadow,
  });

  circle.everyFrame = () => {
    circle.offset = circle.offset.plus(
      Math.random() - 0.5,
      Math.random() - 0.5
    );

    circle.rotateClockwise(Angle.degrees(Math.random() - 0.5));
  };

  return circle;
});

const gradient = new LinearGradient()
  .addColorStop(0, Color.rgb(64, 67, 226, 128))
  .addColorStop(1, Color.rgb(72, 23, 100));

const rotatingSquare = canvas.rectangle({
  anchor: canvas.center,
  origin: "center",
  fill: gradient,
  stroke: "none",
  width: 250,
  height: 250,
});

rotatingSquare.text({
  textContent: "Web Spinner",
  align: "center",
  size: 40,
  fill: Color.rgb(153, 206, 224),
  stroke: "none",
});

rotatingSquare.listen.click(() => {
  rotatingSquare.angle.degrees += 30;
});

document.body.appendChild(canvas);

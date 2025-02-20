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

const state = createState({
  counter: 0,
});

const test = canvas.mouse;

const gradient = new ConicalGradient();

gradient.addColorStop(0, Color.rgb(255, 100, 100));

gradient.addColorStop(1, Color.rgb(100, 100, 200));

const rectangle = canvas.rectangle({
  position: test,
  fill: gradient,
  width: 100,
  height: 400,
});

// state.counter.addChangeListener((updatedValue) => {
//   rectangle.rotateClockwise(Angle.degrees(10));
// });

// rectangle.listen.click(() => {
//   state.counter.value++;
// });

canvas.ellipse({ fill: gradient, anchor: canvas.mouse });

canvas.line({ stroke: gradient, lineWidth: 5, to: Vector2D.xy(100, 400) });

const text = canvas.text({
  size: 50,
  anchor: canvas.center,
  fill: gradient,
  stroke: "none",
});

text.textContent = `CONTENT`;

document.body.appendChild(canvas);

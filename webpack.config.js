import path from "path";
import { sourceMapsEnabled } from "process";

export default {
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: {
          loader: "ts-loader",
        },
        exclude: [/node_modules/, /tests/, /docs/],
      },
    ],
  },
  mode: "development",
  resolve: {
    extensions: [".ts"],
  },
  experiments: { outputModule: true },
  output: {
    filename: "webSpinner.js",
    path: path.resolve(import.meta.dirname, "dist"),
    libraryTarget: "module",
  },
};

import path from "path";

export default {
  entry: "./src/index.ts",
  module: {
    rules: [{ use: "ts-loader", exclude: "/node_modules/" }],
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

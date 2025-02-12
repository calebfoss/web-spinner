const path = require("path");

module.exports = {
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
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "module",
  },
};

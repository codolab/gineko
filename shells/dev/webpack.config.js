const { resolve } = require("path");
const { DefinePlugin } = require("webpack");

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  console.error("NODE_ENV not set");
  process.exit(1);
}

const TARGET = process.env.TARGET;
if (!TARGET) {
  console.error("TARGET not set");
  process.exit(1);
}

const __DEV__ = NODE_ENV === "development";

const root = resolve(__dirname, "../..");

const config = {
  mode: __DEV__ ? "development" : "production",
  devtool: false,
  entry: {
    index: "./src/index.js",
  },
  resolve: {
    modules: [resolve(root, "src"), "node_modules"],
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      src: resolve(root, "src"),
    },
  },
  plugins: [
    new DefinePlugin({
      __DEV__,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          configFile: resolve(root, ".babelrc"),
        },
      },
    ],
  },
};

if (TARGET === "local") {
  config.devServer = {
    hot: true,
    port: 8080,
    clientLogLevel: "warning",
    publicPath: "/dist/",
    stats: "errors-only",
  };
} else {
  config.output = {
    path: resolve(__dirname, "dist"),
    filename: "[name].js",
  };
}

module.exports = config;

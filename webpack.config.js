const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const ManifestVersionSyncPlugin = require("webpack-manifest-version-sync-plugin");

module.exports = {
  entry: {
    content: "./src/content.js",
    background: "./src/background.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
    libraryTarget: "umd", // Add this line
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.wasm$/,
        loader: "file-loader",
        type: "javascript/auto",
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      {
        from: "./src/manifest.json",
        to: "./manifest.json",
      },
      { from: "./src/assets", to: "./assets" },
    ]),
    new ManifestVersionSyncPlugin({
      manifestPath: "./manifest.json"
    }),
  ],
  optimization: {
    minimize: true,
  },
  mode: "production",
  stats: "minimal",
};

import ExtractCssChunks from "extract-css-chunks-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { HotModuleReplacementPlugin } from "webpack";

// repeated config settings / paths
const exclude = /node_modules/;
const include = path.resolve(__dirname, "src", "client", "index.jsx");

// development plugins
const plugins = [
  new HotModuleReplacementPlugin(),
  new ExtractCssChunks({
    chunkFilename: "[id].[hash].css",
    cssModules: true,
    filename: "[name].[hash].css",
    hot: true
  }),
  new HtmlWebpackPlugin({
    favicon: path.resolve(__dirname, "public", "favicon.ico"),
    template: path.resolve(__dirname, "public", "index.html")
  })
];

const devConfig = {
  context: path.resolve(__dirname, "."),
  devtool: "cheap-module-eval-source-map",
  entry: {
    client: ["webpack-hot-middleware/client", include] // "webpack-hot-middleware/client?&reload=true"
  },
  mode: "development",
  module: {
    rules: [
      {
        exclude,
        loader: "style-loader",
        test: /\.css$/
      },
      {
        exclude,
        loader: "css-loader",
        options: {
          modules: true
        },
        test: /\.css$/
      },
      {
        exclude,
        include,
        loaders: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-transform-runtime" // optimizes bundling by disabling babel bloat
          ]
        },
        test: /\.jsx?$/
      },
      {
        enforce: "pre",
        exclude,
        loader: "source-map-loader",
        test: /\.js$/
      }
    ]
  },
  optimization: {
    nodeEnv: "development"
  },
  output: {
    filename: "[name].[hash].bundle.js",
    publicPath: "/"
  },
  plugins,
  resolve: {
    extensions: [".js", ".jsx", "*"] // ! add loader for `.png`
  },
  target: "web"
};

export default devConfig;

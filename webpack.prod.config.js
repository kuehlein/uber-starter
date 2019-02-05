import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import path from "path";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import { optimize } from "webpack";

// repeated config settings / paths
const exclude = /node_modules/;
const include = path.resolve(__dirname, "src", "client", "index.tsx");

// production plugins
const plugins = [
  new optimize.ModuleConcatenationPlugin(),
  new MiniCssExtractPlugin({
    chunkFilename: "[id].[hash].css",
    filename: "[name].[hash].css"
  }),
  new OptimizeCssAssetsPlugin({})
];
const minimizer = [
  new UglifyJsPlugin({
    cache: true,
    parallel: true,
    uglifyOptions: {
      compress: {
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        ie8: false,
        if_return: true,
        join_vars: true,
        keep_fnames: false,
        negate_iife: false,
        sequences: true,
        unused: true,
        warnings: false
      },
      mangle: {
        ie8: false
      },
      output: {
        comments: false
      }
    }
  })
];

const prodConfig = {
  context: path.resolve(__dirname, "."),
  devtool: "cheap-module-source-map",
  entry: include,
  mode: "production",
  module: {
    rules: [
      {
        exclude,
        loader: MiniCssExtractPlugin.loader,
        options: {},
        test: /\.css$/
      },
      {
        exclude,
        loader: "css-loader",
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
            "@babel/plugin-transform-runtime", // optimizes bundling by disabling babel bloat
            "lodash" // avoids bundling unused lodash methods
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
    minimizer
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "public", "dist")
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".tsx", "*"]
  },
  target: "web"
};

export default prodConfig;

import ExtractCssChunks from "extract-css-chunks-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import webpack from "webpack";

// ! alternative for this?
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// repeated config settings / paths
const exclude = /node_modules/;
const include = path.resolve(__dirname, "src", "client"); // ! , "index.jsx");

// development plugins
const plugins = [
  new webpack.HotModuleReplacementPlugin(),
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
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./public/assets/media/",
              publicPath: "./public/assets/media/"
            }
          }
        ]
      },
      {
        exclude,
        include,
        loaders: "babel-loader",
        options: {
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-transform-runtime", // optimizes bundling by disabling babel bloat
            "lodash" // avoids bundling unused lodash methods
          ],
          presets: ["@babel/preset-env", "@babel/preset-react"]
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
    path: path.resolve(__dirname, "public", "dist"),
    publicPath: "/"
  },
  plugins,
  resolve: {
    extensions: [".js", ".jsx", ".jpg", ".png", ".gif", ".svg", "*"]
  },
  target: "web"
};

export default devConfig;

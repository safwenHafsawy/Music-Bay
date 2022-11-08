const path = require("path");
const HttpWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CSSMinimizer = require("css-minimizer-webpack-plugin");
const Terser = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const DotEnv = require("dotenv-webpack");

const LAUNCH_COMMAND = process.env.npm_lifecycle_event; //getting which stage of the cycle is being executed
const isDev = LAUNCH_COMMAND === "start" ? true : false; //check which webpack config to use

/*
 *
 *           BASE CONFIGS (shared between development and production)
 *
 * */

const baseConfig = {
  entry: {
    main: path.resolve(__dirname, "src", "index.jsx"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.[contenthash].js",
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new CSSMinimizer(), new Terser()],
  },

  plugins: [
    new HttpWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      filename: "index.html",
      title: "Music Bay",
    }),

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public", "imgs"),
          to: path.resolve(__dirname, "dist", "public", "imgs"),
        },
        {
          from: path.resolve(__dirname, "public", "music"),
          to: path.resolve(__dirname, "dist", "public", "music"),
        },
      ],
    }),

    new DotEnv(),
  ],
  module: {
    rules: [
      {
        test: /\.(png|gif|jpg)$/,
        use: [{ loader: "url-loader", options: { limit: 5000 } }],
      },
      {
        test: /\.svg$/,
        use: ["svg-url-loader"],
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: "babel-loader",
            options: { presets: ["@babel/preset-react", "@babel/preset-env"] },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ["", ".js", ".jsx"],
  },
};

/*
 *
 *           PRODUCTION CONFIGURATIONS
 *
 *
 */

const prodConfig = {
  mode: "production",
  module: {
    rules: [
      ...baseConfig.module.rules,
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [...baseConfig.plugins, new MiniCssExtractPlugin()],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

/*
 *
 *           DEVELOPMENT CONFIGURATIONS
 *
 * */

const devConfigs = {
  mode: "development",
  devServer: {
    client: {
      logging: "error",
    },
    port: 5050,
    hot: true,
    open: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      ...baseConfig.module.rules,
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};

module.exports = isDev ? { ...baseConfig, ...devConfigs } : { ...baseConfig, ...prodConfig };

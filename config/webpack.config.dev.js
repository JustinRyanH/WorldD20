'use strict';

const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const Paths = require('./paths');

module.exports = {
  entry: Paths.appIndex,
  output: {
    filename: "bundle.js",
    path: Paths.appBuild,
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    modules: Paths.resolvedPaths
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ]
  },

  plugins: [new HtmlWebpackPlugin({
    title: 'Typescript React App',
    template: Paths.appHtml,
  })],
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "react-router-dom": "ReactRouterDOM"
  },
};
var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = require('./webpack.base.config.js');

config.output.path = require('path').resolve('./assets/dist');
config.output.filename = "[name]-[hash].js";

config.plugins = config.plugins.concat([
  new BundleTracker({filename: './webpack-stats-prod.json'}),
  new ExtractTextPlugin("[name]-[hash].css"),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
  }}),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  })
]);

module.exports = config;
var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = require('./webpack.base.config.js');

config.plugins = config.plugins.concat([
  new BundleTracker({filename: './webpack-stats.json'}),
  new ExtractTextPlugin("[name].css")
]);


module.exports = config;
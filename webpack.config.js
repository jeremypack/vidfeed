var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  context: __dirname,
  entry: ['./assets/js/index', './assets/less/site.less'],
  output: {
    path: path.resolve('./assets/bundles/'),
    filename: "[name].js"
  },
  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    new ExtractTextPlugin("[name].css")
  ],
  module: {
    // preLoaders: [
    //   {
    //     test: /\.jsx?$/,
    //     exclude: /node_modules/,
    //     loader: 'jshint-loader'
    //   }
    // ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  }
};

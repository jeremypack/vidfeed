var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  context: __dirname,
  entry: [
    './assets/js/index', 
    './assets/scss/site.scss'
  ],
  output: {
    path: path.resolve('./assets/bundles/'),
    filename: "[name]-[hash].js"
  },
  plugins: [
    // new BundleTracker({filename: './webpack-stats.json'}),
    // new ExtractTextPlugin("[name].css")
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader:  'babel-loader'
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      },
      { 
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/, 
        loader: 'url-loader?limit=100000' 
      }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  }
};

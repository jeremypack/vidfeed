window.jQuery = window.$ = require('jquery');
var $ = window.$;
var Utils = require('./utils');
Utils.setupAjax();

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./app');
var feed = require('./feed');


ReactDOM.render(<App/>, document.getElementById('react-app'));


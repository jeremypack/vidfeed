window.jQuery = window.$ = require('jquery');
const $ = window.$;
var Utils = require('./utils');
Utils.setupAjax();

var React = require('react');
const ReactDOM = require('react-dom');
var App = require('./app');
var LoginForm = require('./login');

ReactDOM.render(<LoginForm/>, document.getElementById('react-app'));
//ReactDOM.render(<App/>, document.getElementById('react-app'));

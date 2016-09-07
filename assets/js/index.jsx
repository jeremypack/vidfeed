window.jQuery = window.$ = require('jquery');
var $ = window.$;

var Utils = require ('./utils');
Utils.setupAjax();

var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Link, browserHistory } from 'react-router'

var Home = require('./views/Home');
var Feed = require('./views/Feed');

ReactDOM.render(<Router history={browserHistory}>
    
    <Route path="/" component={Home} />
    <Route path="/app/feed/:feedId" component={Feed} />

</Router>, document.getElementById('react-app'));
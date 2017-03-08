window.jQuery = window.$ = require('jquery');
var $ = window.$;

var Utils = require ('./utils');
Utils.setupAjax();

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router'

import Home from './views/Home';
import Feed from './views/Feed';
import Dashboard from './views/Dashboard';

ReactDOM.render(<Router history={browserHistory}>
    
    <Route path="/" component={Home} />
    <Route path="/app/dashboard/:projectId" component={Dashboard} />
    <Route path="/app/feed/:feedId" component={Feed} />

</Router>, document.getElementById('react-app'));
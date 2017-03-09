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
import Account from './views/Account';
import LoginContainer from './containers/LoginContainer';
import RegisterContainer from './containers/RegisterContainer';
import ForgotPasswordContainer from './containers/ForgotPasswordContainer';
import AccountContainer from './containers/AccountContainer';


ReactDOM.render(<Router history={browserHistory}>
    
    <Route path="/" component={Home} />
    
    <Route component={Account}>
        <Route path="/app/login" component={LoginContainer} />
        <Route path="/app/register" component={RegisterContainer} />
        <Route path="/app/forgotpassword" component={ForgotPasswordContainer} />
        <Route path="/app/account" component={AccountContainer} />
    </Route>

    <Route path="/app/dashboard" component={Dashboard} />
    <Route path="/app/dashboard/:projectId" component={Dashboard} />
    <Route path="/app/feed/:feedId" component={Feed} />

</Router>, document.getElementById('react-app'));
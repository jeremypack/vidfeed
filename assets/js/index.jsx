window.jQuery = window.$ = require('jquery');
var $ = window.$;
import Utils from './utils';
Utils.setupAjax();

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './app';
import TestCreateFeed from './testCreateFeed';
import TestFeed from './testFeed';



var feed = require('./feed');


ReactDOM.render(<Router history={browserHistory}>
                  <Route path="/" component={TestCreateFeed} />
                  <Route path="/app/feed/:feedId" component={TestFeed} />
                </Router>, document.getElementById('react-app'));


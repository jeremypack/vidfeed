window.jQuery = window.$ = require('jquery');
var $ = window.$;
import Utils from './utils';
Utils.setupAjax();

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router';

import CreateFeed from './createFeed';


import Feed from './feed';


ReactDOM.render(<Router history={browserHistory}>
  <Route path="/" component={CreateFeed} />
  <Route path="/app/feed/:feedId" component={Feed} />
</Router>, document.getElementById('react-app'));


// ReactDOM.render(<App />, document.getElementById('react-app'));
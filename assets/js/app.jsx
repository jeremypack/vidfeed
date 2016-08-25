var React = require('react');
var LoginForm = require('./auth/login');
var LogoutForm = require('./auth/logout');
var CommentContainer = require('./comments/commentContainer');

// temporary for testing stuff
var TestCreateFeed = require('./testCreateFeed');
var TestFeed = require('./testFeed.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {isAuthenticated: window.vidfeed.isAuthenticated};
  },
  setAuthentication(authVal) {
    if (this.isMounted())
      this.setState({isAuthenticated: authVal});
  },
  render: function(){
    var authForm;
    if (this.state.isAuthenticated) {
      authForm = <LogoutForm setAuthentication={this.setAuthentication} />;
    } else {
      authForm = <LoginForm setAuthentication={this.setAuthentication} />;
    }
    return (
      <div>
        {authForm}
        <TestCreateFeed />
        <CommentContainer />
        <TestFeed />
      </div>);
 }
});
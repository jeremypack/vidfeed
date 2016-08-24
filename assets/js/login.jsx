var React = require('react');

module.exports =  React.createClass({
  getInitialState: function() {
    return {email: '', password: ''};
  },
  handleEmailChange: function(e) {
    this.setState({email: e.target.value});
  },
  handlePasswordChange: function(e) {
    this.setState({password: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var email = this.state.email.trim();
    var password = this.state.password.trim();
    if (!email || !password) {
      return;
    }
    $.ajax({
      type: 'POST',
      url: '/api/auth/login/',
      data: {
        email: email,
        password: password
      },
      success: function (){
        console.log('successfully logged in');
      },
      error: function () {
        console.log('failed to login');
      }
    });

    this.setState({email: '', password: ''});
  },
  render: function() {
    return (
      <form className="loginForm" onSubmit={this.handleSubmit}>
        <input
          type="Email"
          placeholder="Email"
          value={this.state.email}
          onChange={this.handleEmailChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.handlePasswordChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});
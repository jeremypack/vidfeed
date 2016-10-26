var React = require('react');

module.exports =  React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      context: this,
      url: '/api/auth/logout/',
      data: {},
      success: function (ev){
        this.props.setAuthentication(false);
      }
    });
  },
  render: function() {
    return (
      <div>
        <form className="logoutForm" onSubmit={this.handleSubmit}>
          <input type="submit" value="Logout" />
        </form>
      </div>
    );
  }
});
var React = require('react');

module.exports = React.createClass({
  render: function () {
    return <ul> {this.props.comments.map(this.renderComment)} </ul>;
  },
  renderComment: function ({id, body, created}) {
    return <li key={id}>{body} - {created}</li>;
  }
});
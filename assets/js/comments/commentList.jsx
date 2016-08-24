var React = require('react');

module.exports = React.createClass({
  render: function () {
    return <ul> {this.props.comments.map(this.renderComment)} </ul>;
  },
  renderComment: function ({id, text, author}) {
    return <li key={id}>{text} - {author}</li>;
  }
});
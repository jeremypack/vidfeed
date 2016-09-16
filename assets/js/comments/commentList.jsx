var React = require('react');

module.exports = React.createClass({
  render: function () {
    return <ul> {this.props.comments.map(this.renderComment)} </ul>;
  },
  renderComment: function ({id, body, created, owner}) {
    return (<li key={id}>
              {body}<br />
              {owner.first_name} {owner.last_name}<br />
              {owner.email}<br />
              {created}<br />
              commentId = {id}
            </li>);
  }
});
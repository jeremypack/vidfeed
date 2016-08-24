var React = require('react');
var CommentList = require('./commentList');

module.exports = React.createClass({
  getInitialState: function() {
    return {comments: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: "/api/comments/",
      dataType: 'json',
      context: this,
      success: function(comments) {
        this.setState({comments: comments});
      }
    });
  },
  render: function(){
    return <CommentList comments={this.state.comments} />;
  }
});
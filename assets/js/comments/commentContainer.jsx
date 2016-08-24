var React = require('react');
var CommentList = require('./commentList');

module.exports = React.createClass({
  getInitialState: function() {
    return {comments: []};
  },
  componentDidMount: function() {
    this.setState({comments: [
      {id: 1, text: 'test comment 1', author: 'test author 1'},
      {id: 2, text: 'test comment 2', author: 'test author 2'},
    ]});
    // $.ajax({
    //   url: "/vidfeed/comments/",
    //   dataType: 'json',
    //   context: this,
    //   success: function(comments) {
    //     this.setState({comments: comments});
    //   }
    // });
  },
  render: function(){
    return <CommentList comments={this.state.comments} />;
  }
});
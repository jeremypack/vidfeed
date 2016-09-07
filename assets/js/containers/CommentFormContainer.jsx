var React = require('react');

var CommentForm = require('../components/CommentForm');

var CommentFormContainer = React.createClass({
    
    getInitialState: function() {
        return {author: '', comment: '', timecode: '0.0'};
    },

    handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },

    handleCommentChange: function(e) {
        this.setState({comment: e.target.value});
    },

    handleTimecodeChange: function (e) {
        this.setState({timecode: e.target.value});
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var comment = this.state.comment.trim();
        if (!comment || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, body: comment, timecode: this.state.timecode});
        this.setState({author: '', comment: '', timecode: '0.0'});
    },

    render: function() {
        return (
            <CommentForm
                handleSubmit={this.handleSubmit}
                handleAuthorChange={this.handleAuthorChange}
                handleCommentChange={this.handleCommentChange}
                handleTimecodeChange={this.handleTimecodeChange} />
        );
    }
});

module.exports = CommentFormContainer;
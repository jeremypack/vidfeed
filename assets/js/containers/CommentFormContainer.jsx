var React = require('react');

var CommentForm = require('../components/CommentForm');

var CommentFormContainer = React.createClass({
    
    getInitialState: function() {
        return {author: '', comment: '', parentId: ''};
    },

    handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },

    handleCommentChange: function(e) {
        this.setState({comment: e.target.value});
    },

    handleParentIdChange: function (e) {
        this.setState({parentId: e.target.value});
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var comment = this.state.comment.trim();
        var parentId = this.state.parentId.trim();
        if (!comment || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, body: comment, parent_id: parentId});
        this.setState({author: '', comment: '', parentId: ''});
    },

    render: function() {
        return (
            <CommentForm
                handleSubmit={this.handleSubmit}
                handleAuthorChange={this.handleAuthorChange}
                handleCommentChange={this.handleCommentChange}
                handleParentIdChange={this.handleParentIdChange} />
        );
    }
});

module.exports = CommentFormContainer;
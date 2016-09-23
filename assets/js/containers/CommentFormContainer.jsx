var React = require('react');

var CommentForm = require('../components/CommentForm');

var CommentFormContainer = React.createClass({
    
    getInitialState: function() {
        return {
            author: '',
            comment: ''
        };
    },

    _handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },

    _handleCommentChange: function(e) {
        this.setState({comment: e.target.value});
    },

    _handleSubmit: function(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var comment = this.state.comment.trim();
        if (!comment || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, body: comment});
        this.setState({author: '', comment: ''});
    },

    render: function() {
        return (
            <CommentForm
                handleSubmit={this._handleSubmit}
                handleAuthorChange={this._handleAuthorChange}
                handleCommentChange={this._handleCommentChange} />
        );
    }
});

module.exports = CommentFormContainer;
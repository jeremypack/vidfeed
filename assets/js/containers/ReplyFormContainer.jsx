var React = require('react');

var ReplyForm = require('../components/ReplyForm');

var ReplyFormContainer = React.createClass({
    
    getInitialState: function() {
        return {author: '', comment: '', parentId: this.props.parentId};
    },

    _handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },

    _handleReplyChange: function(e) {
        this.setState({comment: e.target.value});
    },

    _handleSubmit: function(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var comment = this.state.comment.trim();
        var parentId = this.state.parentId;
        if (!comment || !author) {
            return;
        }
        this.props.onReplySubmit({author: author, body: comment, parent_id: parentId});
        this.setState({author: '', comment: '', parentId: ''});
    },

    render: function() {
        return (
            <ReplyForm
                handleSubmit={this._handleSubmit}
                handleAuthorChange={this._handleAuthorChange}
                handleReplyChange={this._handleReplyChange} />
        );
    }
});

module.exports = ReplyFormContainer;
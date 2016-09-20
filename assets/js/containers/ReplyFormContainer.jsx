var React = require('react');

var ReplyForm = require('../components/ReplyForm');

var ReplyFormContainer = React.createClass({
    
    getInitialState: function() {
        return {author: '', comment: '', parentId: this.props.parentId};
    },

    handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },

    handleReplyChange: function(e) {
        this.setState({comment: e.target.value});
    },

    handleSubmit: function(e) {
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
                handleSubmit={this.handleSubmit}
                handleAuthorChange={this.handleAuthorChange}
                handleReplyChange={this.handleReplyChange}
                parentId={this.state.parentId} />
        );
    }
});

module.exports = ReplyFormContainer;
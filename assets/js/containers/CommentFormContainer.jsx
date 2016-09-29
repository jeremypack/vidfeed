var React = require('react');

var CommentForm = require('../components/CommentForm');

var CommentFormContainer = React.createClass({
    
    getInitialState: function() {
        return {
            author: null,
            comment: null
        };
    },

    _handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },

    _handleCommentChange: function(e) {
        this.setState({comment: e.target.value});
    },

    _handleCommentSubmit: function(e) {
        e.preventDefault();
        var comment = {};
        var author = this.state.author.trim();
        var body = this.state.comment.trim();
        if (!body || !author) {
            return;
        }
        var timecode = this.props.timecodeSeconds;
        comment.author = author;
        comment.body = body;
        comment.timecode = timecode;
        $.ajax({
            url: '/api/feeds/' + this.props.feedId + '/comments',
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                console.log(data,'comment success');
            }.bind(this),
            error: function(data) {
                console.log(JSON.parse(data.responseText),'handleCommentSubmit error');
            }.bind(this)
        });
    },

    render: function() {
        return (
            <CommentForm
                timecode={this.props.timecode}
                handleSubmit={this._handleCommentSubmit}
                handleAuthorChange={this._handleAuthorChange}
                handleCommentChange={this._handleCommentChange} />
        );
    }
});

module.exports = CommentFormContainer;
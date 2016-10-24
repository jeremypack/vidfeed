var React = require('react');

var ReplyForm = require('../components/ReplyForm');

var ReplyFormContainer = React.createClass({
    
    propTypes: {
        parentId:       React.PropTypes.number.isRequired,
        submitted:      React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            author: '',
            comment: '',
            parentId: this.props.parentId
        };
    },

    componentDidMount:function() {
        this._getSessionUser();
    },

    _getSessionUser: function() {
        if (window.vidfeed.user.email) {
            this.setState({
                author:window.vidfeed.user.email
            });
        }
    },

    _handleReplyChange: function(e) {
        this.setState({
            comment: e.target.value
        });
    },

    _handleReplySubmit: function(e) {
        e.preventDefault();
        var comment = {};
        var author = this.state.author.trim();
        var body = this.state.comment.trim();
        var parentId = this.state.parentId;
        if (!body || !author) {
            return;
        }
        comment.author = author;
        comment.body = body;
        comment.parent_id = parentId;
        $.ajax({
            url: '/api/feeds/' + this.props.feedId + '/comments',
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                this.props.submitted();
            }.bind(this),
            error: function(data) {
                console.log(JSON.parse(data.responseText),'handleCommentSubmit error');
            }.bind(this)
        });
        this.setState({
            author: 'example@email.com',
            comment: '',
            parentId: null
        });
    },

    render: function() {
        return (
            <ReplyForm
                handleReplySubmit={this._handleReplySubmit}
                handleReplyChange={this._handleReplyChange} />
        );
    }
});

module.exports = ReplyFormContainer;
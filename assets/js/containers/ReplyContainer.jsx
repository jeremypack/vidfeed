var React = require('react');

var Comment = require('../components/Comment');
var EditComment = require('../components/EditComment');

var ReplyCommentContainer = React.createClass({
    
    getInitialState: function() {
        return {
            editable: false,
            replyBody: this.props.value
        };
    },

    _setEditMode: function(e) {
        e.preventDefault();
        this.setState({editable:true});
    },

    _cancelEdit: function(e){
        e.preventDefault();
        this.setState({editable:false, replyBody: this.props.body});
    },

    _saveEdit: function (e) {
        e.preventDefault();
        var replyId = $(e.currentTarget).closest('.c-comment').data('id');
        this.props.editReply(replyId, this.props.author, this.state.replyBody);
        this.setState({editable:false});
    },

    _deleteReply: function (e) {
        e.preventDefault();
        var replyId = $(e.currentTarget).closest('.c-comment').data('id');
        this.props.deleteReply(replyId);
    },

    _handleReplyChange: function (e) {
        this.setState({replyBody: e.target.value});
    },

    render: function () {
        if (this.state.editable) {
            return (
                <EditComment 
                    id={this.props.id}
                    author={this.props.author}
                    value={this.state.replyBody}
                    isReply={this.props.isReply}
                    handleChange={this._handleReplyChange}
                    saveChange={this._saveEdit}
                    cancelChange={this._cancelEdit} />
            );
        } else {
            return (
                <Comment
                    id={this.props.id}
                    author={this.props.author}
                    value={this.state.replyBody}
                    isReply={this.props.isReply}
                    created={this.props.created} 
                    editComment={this._setEditMode} 
                    deleteComment={this._deleteReply} />
            );   
        }
    }

});

module.exports = ReplyCommentContainer;
var React = require('react');

var Comment = require('../components/Comment');
var EditComment = require('../components/EditComment');
var ReplyFormContainer = require('../containers/ReplyFormContainer');

var CommentContainer = React.createClass({
    
    getInitialState: function() {
        return {
            editable: false,
            replyOpen: false,
            commentBody: this.props.body
        };
    },

    _setEditMode: function(e) {
        e.preventDefault();
        this.setState({editable:true});
    },


    _toggleReply: function(e) {
        e.preventDefault();
        this.setState({replyOpen:!this.state.replyOpen});
    },

    _formattedTime: function (time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.floor(time % 60).toFixed(0);
        var hours = Math.floor(minutes / 60);
        minutes = minutes - hours * 60;
        seconds = (seconds.length == 1 ? "0" : "") + seconds;
        var hoursString = "";
        if (hours > 0) {
            hoursString = hours.toString() + ":";
            minutes = (minutes.toString().length == 1 ? "0" : "") + minutes.toString();
        }
        return hoursString + minutes + ":" + seconds;
    },

    _cancelEdit: function(e){
        e.preventDefault();
        this.setState({editable:false, commentBody: this.props.body});
    },

    _saveEdit: function (e) {
        e.preventDefault();
        var commentId = $(e.currentTarget).closest('.comment').data('id');
        this.props.handleCommentEdit(commentId, this.props.author, this.state.commentBody);
        this.setState({editable:false});
    },

    _deleteComment: function (e) {
        e.preventDefault();
        var commentId = $(e.currentTarget).closest('.comment').data('id');
        this.props.handleDeleteComment(commentId);
    },

    _handleCommentChange: function (e) {
        this.setState({commentBody: e.target.value});
    },

    _handleReplySubmit: function(data) {
        console.log(data,'_handleReplySubmit data');
        this.props.handleReply(data);
    },

    render: function() {
        var formattedTime = this._formattedTime(this.props.timecode);

        if (this.state.editable) {
            return (
                <EditComment 
                    id={this.props.id}
                    value={this.state.commentBody}
                    handleChange={this._handleCommentChange}
                    saveChange={this._saveEdit}
                    cancelChange={this._cancelEdit} />
            );
        } else {
            return (
                <div>
                    <Comment
                        id={this.props.id}
                        author={this.props.author}
                        parentCommentId={this.props.parentCommentId}
                        value={this.state.commentBody}
                        timecode={formattedTime}
                        created={this.props.time} 
                        editComment={this._setEditMode} 
                        deleteComment={this._deleteComment}
                        toggleReply={this._toggleReply}
                        showReply={this.state.replyOpen} />
                    {this.state.replyOpen ? 
                        <ReplyFormContainer 
                            onReplySubmit={this._handleReplySubmit}
                            parentId = {this.props.id} /> : null}
                </div>
            );   
        }
    }

});

module.exports = CommentContainer;
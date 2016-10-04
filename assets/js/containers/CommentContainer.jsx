var React = require('react');

var Comment = require('../components/Comment');
var EditComment = require('../components/EditComment');
var ReplyContainer = require('../containers/ReplyContainer');
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
        console.log($(e.currentTarget).closest('.c-comment').data('id'),'e.currentTarget');
        console.log(this.props);
        this.setState({editable:true});
    },

    _cancelEdit: function(e){
        e.preventDefault();
        this.setState({editable:false, commentBody: this.props.body});
    },

    _saveEdit: function (e) {
        e.preventDefault();
        var commentId = $(e.currentTarget).closest('.c-comment').data('id');
        console.log(commentId,'commentId');
        this.props.handleCommentEdit(commentId, this.props.author, this.state.commentBody);
        this.setState({editable:false});
    },

    _saveReplyEdit: function(replyId, author, text) {
        this.props.handleCommentEdit(replyId, author, text);
    },

    _deleteComment: function (e) {
        e.preventDefault();
        var commentId = $(e.currentTarget).closest('.c-comment').data('id');
        this.props.handleDeleteComment(commentId);
    },

    _deleteReply: function (replyId) {
        this.props.handleDeleteComment(replyId);
    },

    _toggleReply: function(e) {
        if (e) {
           e.preventDefault(); 
        }
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

    _handleCommentChange: function (e) {
        this.setState({commentBody: e.target.value});
    },

    render: function() {
        var formattedTime = this._formattedTime(this.props.timecode);
                
        if (this.props.children.length) {
            var editReply = this._saveReplyEdit;
            var deleteReply = this._deleteReply; 
            var repliesArr = this.props.children;
            var replyNodes = repliesArr.map(function(reply){
                return (
                    <ReplyContainer
                        id={reply.id}
                        key={reply.id}
                        author={reply.owner.email}
                        parentCommentId={reply.parent_id}
                        value={reply.body}
                        created={reply.created}
                        isReply={true}
                        editReply={editReply} 
                        deleteReply={deleteReply} />
                );
            });
        }

        if (this.state.replyOpen) {
            var replyForm = <ReplyFormContainer
                                feedId = {this.props.feedId}
                                parentId = {this.props.id}
                                submitted = {this._toggleReply} />
        }

        if (this.state.editable) {
            return (
                <div className="c-comment__outer">
                    <EditComment 
                        id={this.props.id}
                        value={this.state.commentBody}
                        handleChange={this._handleCommentChange}
                        saveChange={this._saveEdit}
                        cancelChange={this._cancelEdit} />
                    {replyNodes}
                </div>
            );

        } else {

            return (
                <div className="c-comment__outer">
                    <Comment
                        id={this.props.id}
                        author={this.props.author}
                        value={this.state.commentBody}
                        isReply={false}
                        timecode={formattedTime}
                        created={this.props.time} 
                        editComment={this._setEditMode} 
                        deleteComment={this._deleteComment}
                        toggleReply={this._toggleReply}
                        showReply={this.state.replyOpen} />
                    {replyNodes}
                    {replyForm}
                </div>
            );   
        }
    }

});

module.exports = CommentContainer;
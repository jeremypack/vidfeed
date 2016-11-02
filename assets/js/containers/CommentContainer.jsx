var React = require('react');

var Comment = require('../components/Comment');
var EditComment = require('../components/EditComment');
var ReplyContainer = require('../containers/ReplyContainer');
var ReplyFormContainer = require('../containers/ReplyFormContainer');

var CommentContainer = React.createClass({
    
    propTypes: {
        author:                 React.PropTypes.string.isRequired,
        body:                   React.PropTypes.string.isRequired,
        children:               React.PropTypes.array,
        modalOpen:              React.PropTypes.func.isRequired,
        modalClose:             React.PropTypes.func.isRequired,
        commentBody:            React.PropTypes.string,
        handleCommentEdit:      React.PropTypes.func.isRequired,
        handleDeleteComment:    React.PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {
            editable: false,
            replyOpen: false,
            commentActions: false,
            commentBody: this.props.body
        };
    },

    componentDidMount: function() {
        var getSessionUser = function() {
            if (window.vidfeed.user.email === this.props.author) {
                this.setState({
                    commentActions: true
                });
                clearInterval(this.sessionCheckInterval);
            }
        }.bind(this);
        this.sessionCheckInterval = setInterval(getSessionUser,1000);
    },

    componentWillUnmount:function(){
        clearInterval(this.sessionCheckInterval);
    },

    _setEditMode: function(e) {
        e.preventDefault();
        this.setState({
            editable:true
        });
    },

    _cancelEdit: function(e){
        e.preventDefault();
        this.setState({
            editable:false,
            commentBody: this.props.body
        });
    },

    _saveEdit: function (e) {
        e.preventDefault();
        var commentId = $(e.currentTarget).closest('.c-comment').data('id');
        this.props.handleCommentEdit(commentId, this.props.author, this.state.commentBody);
        this.setState({
            editable:false
        });
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
        this.setState({
            replyOpen:!this.state.replyOpen
        });
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
        this.setState({
            commentBody: e.target.value
        });
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
                                modalOpen = {this.props.modalOpen}
                                modalClose = {this.props.modalClose}
                                feedId = {this.props.feedId}
                                parentId = {this.props.id}
                                submitted = {this._toggleReply} />
        }

        if (this.state.editable) {
            return (
                <div className="c-comment__outer">
                    <EditComment 
                        id={this.props.id}
                        author={this.props.author}
                        value={this.state.commentBody}
                        timecode={formattedTime}
                        isReply={false}
                        created={this.props.time} 
                        handleChange={this._handleCommentChange}
                        handleSubmit={this._saveEdit}
                        cancelChange={this._cancelEdit} />
                    {replyNodes}
                </div>
            );

        } 

        if (this.state.commentActions) {
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
                        replyIsOpen={this.state.replyOpen} />
                    {replyNodes}
                    {replyForm}
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
                        toggleReply={this._toggleReply}
                        replyIsOpen={this.state.replyOpen} />
                    {replyNodes}
                    {replyForm}
                </div>
            );   
        }
    }

});

module.exports = CommentContainer;
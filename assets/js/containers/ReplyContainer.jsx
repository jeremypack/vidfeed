import React from 'react';

import Comment from '../components/Comment';
import EditComment from '../components/EditComment';

const ReplyContainer = React.createClass({
    
    propTypes: {
        id:             React.PropTypes.number.isRequired,
        authorId:       React.PropTypes.number.isRequired,
        author:         React.PropTypes.string.isRequired,
        value:          React.PropTypes.string.isRequired,
        isReply:        React.PropTypes.bool.isRequired,
        created:        React.PropTypes.string.isRequired,
        toggleReply:    React.PropTypes.func.isRequired,
        replyIsOpen:    React.PropTypes.bool.isRequired,
        editReply:      React.PropTypes.func,
        deleteReply:    React.PropTypes.func
    },

    getInitialState: function() {
        return {
            editable: false,
            commentActions:false,
            replyBody: this.props.value,
            newComment:false
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
        this._checkNewComments();
    },

    componentWillUnmount:function(){
        clearInterval(this.sessionCheckInterval);
    },

    _checkNewComments:function(){        
        var now = new Date();
        var nowMinusTenSecs = new Date(now.getTime() - 10000);
        var commentCreated = new Date(this.props.created);
        if (commentCreated > nowMinusTenSecs) {
            this.setState({
                newComment:true
            });
        }
        setTimeout(function(){
            this.setState({
                newComment:false
            });
        }.bind(this),500)
    },

    _setEditMode: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            editable:true
        });
    },

    _cancelEdit: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            editable:false,
            replyBody: this.props.value
        });
    },

    _saveEdit: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var replyId = $(e.currentTarget).closest('.c-comment').data('id');
        this.props.editReply(replyId, this.props.author, this.state.replyBody);
        this.setState({
            editable:false
        });
    },

    _deleteReply: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var replyId = $(e.currentTarget).closest('.c-comment').data('id');
        this.props.deleteReply(e);
    },

    _handleReplyChange: function (e) {
        this.setState({
            replyBody: e.target.value
        });
    },

    render: function () {
        if (this.state.editable) {
            
            return (
                <EditComment 
                    id={this.props.id}
                    author={this.props.author}
                    authorId={this.props.authorId}
                    value={this.state.replyBody}
                    created={this.props.created}
                    isReply={this.props.isReply}
                    handleChange={this._handleReplyChange}
                    handleSubmit={this._saveEdit}
                    cancelChange={this._cancelEdit} />
            );
        }

        if (this.state.commentActions) {
            
            return (
                <Comment
                    id={this.props.id}
                    author={this.props.author}
                    authorId={this.props.authorId}
                    value={this.state.replyBody}
                    isReply={this.props.isReply}
                    created={this.props.created}
                    toggleReply={this.props.toggleReply}
                    replyIsOpen={this.props.replyIsOpen}
                    editComment={this._setEditMode} 
                    deleteComment={this._deleteReply}
                    newComment={this.state.newComment} />
            );

        } else {
            return (
                <Comment
                    id={this.props.id}
                    author={this.props.author}
                    authorId={this.props.authorId}
                    value={this.state.replyBody}
                    isReply={this.props.isReply}
                    created={this.props.created}
                    toggleReply={this.props.toggleReply}
                    replyIsOpen={this.props.replyIsOpen}
                    newComment={this.state.newComment} />
            );   
        }
    }

});

module.exports = ReplyContainer;
import React from 'react';
import Modal from 'react-modal';

import Comment from '../components/Comment';
import EditComment from '../components/EditComment';
import ReplyContainer from '../containers/ReplyContainer';
import ReplyFormContainer from '../containers/ReplyFormContainer';
import ModalChoice from '../components/ModalChoice';

const modalStyles = {
    overlay : {
        backgroundColor       : 'transparant'
    },
        content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        padding               : '0',
        border                : '0',
        borderRadius          : '0',
        transform             : 'translate(-50%, -50%)',
        transition            : 'opacity .4s ease-in-out',
        opacity               : '0',
        boxShadow             : '1px 1px 4px -1px rgba(0,0,0,.25)'
    }
};

const CommentContainer = React.createClass({
    
    propTypes: {
        id:                     React.PropTypes.number.isRequired,
        author:                 React.PropTypes.string.isRequired,
        authorId:               React.PropTypes.number.isRequired,
        body:                   React.PropTypes.string.isRequired,
        created:                React.PropTypes.string.isRequired,
        children:               React.PropTypes.array,
        modalOpen:              React.PropTypes.func.isRequired,
        modalClose:             React.PropTypes.func.isRequired,
        commentBody:            React.PropTypes.string,
        handleCommentEdit:      React.PropTypes.func.isRequired,
        handleDeleteComment:    React.PropTypes.func.isRequired,
        timecodeClick:          React.PropTypes.func.isRequired,
        closeOpenReplyForms:    React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            editable: false,
            replyOpen: false,
            commentActions: false,
            commentBody: this.props.body,
            deleteCommentCheck:false,
            commentIdToDelete:undefined,
            newComment:false,
            lockHover:false,
            isLocked:false,
            isValid:true,
            validationStarted:false
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

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.closeReplies) {
            this.setState({
                replyOpen:false
            });
        }
        if (this.props.id === nextProps.replyToOpen) {
            this.setState({
                replyOpen:true
            });
        }
    },

    componentWillUnmount:function(){
        clearInterval(this.sessionCheckInterval);
        clearInterval(this.validateInterval);
    },

    _checkNewComments:function(){        
        var now = new Date();
        var nowMinusTenSecs = new Date(now.getTime() - 10000);
        var commentCreated = new Date(this.props.created);
        if (commentCreated > nowMinusTenSecs) {
            this.setState({
                newComment:true
            });
            this.props.commentToScroll(this.props.id);
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
            commentBody: this.props.body
        });
        clearInterval(this.validateInterval);
    },

    _saveEdit: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var body = this.state.commentBody.trim();
        if (!body) {
            return;
        }
        var commentId = $(e.currentTarget).closest('.c-comment').data('id');
        this.props.handleCommentEdit(commentId, this.props.author, body);
        this.setState({
            editable:false,
            commentBody:body
        });
        clearInterval(this.validateInterval);
    },

    _saveReplyEdit: function(replyId, author, text) {
        this.props.handleCommentEdit(replyId, author, text);
    },

    _deleteComment: function (e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (this.state.deleteCommentCheck) {
            this.props.handleDeleteComment(this.state.commentIdToDelete);
            this.props.modalClose();
            this.setState({
                deleteCommentCheck: false,
                commentIdToDelete:undefined
            });
        } else { 
            var id = $(e.currentTarget).closest('.c-comment').data('id');
            this.setState({
                deleteCommentCheck: true,
                commentIdToDelete:id
            }, function(){
                this.props.modalOpen();
            });
        }
    },

    _deleteCommentCancel: function() {
        this.props.modalClose();
        this.setState({
            deleteCommentCheck:false,
            commentIdToDelete:undefined
        });
    },

    _openReplyForm: function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.props.closeOpenReplyForms(this.props.id);
    },

    _closeReply: function() {
        this.props.closeOpenReplyForms();
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
        var validateTrigger = function() {
            if(this.state.commentBody) {
                this.setState({
                    isValid:true
                });
            } else {
                this.setState({
                    isValid:false
                });
            }
        }.bind(this);
        if (!this.state.validationStarted) {
            this.setState({
                validationStarted: true
            });
            this.validateInterval = setInterval(validateTrigger,500);
        }
    },

    _timecodeClick: function(e) {
        e.preventDefault();
        var timecode = this.props.timecode
        this.props.timecodeClick(this.props.timecode);
    },

    _handleLockHoverEnter:function() {
        this.setState({
            lockHover:true
        });
    },

    _handleLockHoverLeave:function() {
        this.setState({
            lockHover:false
        });
    },

    _handleLockClick:function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            isLocked:!this.state.isLocked
        });
    },

    render: function() {

        var formattedTime = this._formattedTime(this.props.timecode);        

        var deleteCommentModal = <Modal
                                    isOpen={this.state.deleteCommentCheck}
                                    onRequestClose={this._deleteCommentCancel}
                                    style={modalStyles}> 
                                    <ModalChoice
                                        closeModal={this._deleteCommentCancel}
                                        yesAction={this._deleteComment}
                                        noAction={this._deleteCommentCancel}
                                        heading='Remove comment'
                                        text='Are you sure?'
                                        yesText='Yep, remove comment'
                                        noText='I&apos;ve changed my mind' />
                                 </Modal>

        


        if (this.props.children.length) {
            var replyNodes = this.props.children.map(function(reply){
                return (
                    <ReplyContainer
                        id={reply.id}
                        key={reply.id}
                        author={reply.owner.email}
                        authorId={reply.owner.id}
                        value={reply.body}
                        created={reply.created}
                        toggleReply={this._openReplyForm}
                        replyIsOpen={this.state.replyOpen}
                        isReply={true}
                        editReply={this._saveReplyEdit} 
                        deleteReply={this._deleteComment} />
                );
            }.bind(this));
        }

        if (this.state.replyOpen) {
            var replyForm = <ReplyFormContainer
                                modalOpen = {this.props.modalOpen}
                                modalClose = {this.props.modalClose}
                                feedId = {this.props.feedId}
                                parentId = {this.props.id}
                                submitted = {this._closeReply} />
        }

        if (this.state.editable) {
            return (
                <div className="c-comment__outer">
                    <EditComment 
                        id={this.props.id}
                        author={this.props.author}
                        authorId={this.props.authorId}
                        value={this.state.commentBody}
                        timecode={formattedTime}
                        isReply={false}
                        created={this.props.created} 
                        handleChange={this._handleCommentChange}
                        handleSubmit={this._saveEdit}
                        cancelChange={this._cancelEdit}
                        isValid={this.state.isValid} />
                    {replyNodes}
                </div>
            );

        } 

        if (this.state.commentActions) {
            return (
                <div className="c-comment__outer" onClick={this._timecodeClick}>
                    <Comment
                        id={this.props.id}
                        author={this.props.author}
                        authorId={this.props.authorId}
                        value={this.state.commentBody}
                        isReply={false}
                        timecode={formattedTime}
                        created={this.props.created} 
                        editComment={this._setEditMode} 
                        deleteComment={this._deleteComment}
                        toggleReply={this._openReplyForm}
                        replyIsOpen={this.state.replyOpen}
                        newComment={this.state.newComment}
                        handleLockHoverEnter={this._handleLockHoverEnter}
                        handleLockHoverLeave={this._handleLockHoverLeave}
                        handleLockClick={this._handleLockClick}
                        lockHover={this.state.lockHover}
                        isLocked={this.state.isLocked} />
                    {replyNodes}
                    {replyForm}
                    {deleteCommentModal}
                </div>

            );
        
        } else {
            
            return (
                <div className="c-comment__outer" onClick={this._timecodeClick}>
                    <Comment
                        id={this.props.id}
                        author={this.props.author}
                        authorId={this.props.authorId}
                        value={this.state.commentBody}
                        isReply={false}
                        timecode={formattedTime}
                        created={this.props.created} 
                        toggleReply={this._openReplyForm}
                        replyIsOpen={this.state.replyOpen}
                        newComment={this.state.newComment}
                        handleLockHoverEnter={this._handleLockHoverEnter}
                        handleLockHoverLeave={this._handleLockHoverLeave}
                        handleLockClick={this._handleLockClick}
                        lockHover={this.state.lockHover}
                        isLocked={this.state.isLocked} />
                    {replyNodes}
                    {replyForm}
                    {deleteCommentModal}
                </div>
            );   
        }
    }

});

module.exports = CommentContainer;
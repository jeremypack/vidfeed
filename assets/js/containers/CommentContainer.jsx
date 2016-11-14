var React = require('react');
var Modal = require('react-modal');

var Comment = require('../components/Comment');
var EditComment = require('../components/EditComment');
var ReplyContainer = require('../containers/ReplyContainer');
var ReplyFormContainer = require('../containers/ReplyFormContainer');
var ModalChoice = require('../components/ModalChoice');

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

var CommentContainer = React.createClass({
    
    propTypes: {
        id:                     React.PropTypes.number.isRequired,
        author:                 React.PropTypes.string.isRequired,
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

    _deleteComment: function (e, id) {
        if (e) {
            e.preventDefault();
        }
        if (this.state.deleteCommentCheck) {
            this.props.handleDeleteComment(this.state.commentIdToDelete);
            this.props.modalClose();
            this.setState({
                deleteCommentCheck: false,
                commentIdToDelete:undefined
            });
        } else { 
            if (!id) {
                id = $(e.currentTarget).closest('.c-comment').data('id');
            }
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

    _openReply: function(e) {
        if (e) {
           e.preventDefault(); 
        }
        this.setState({
            replyOpen:false
        }, function(){
            this.props.closeOpenReplyForms(this.props.id);
        })
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
    },

    _timecodeClick: function(e) {
        e.preventDefault();
        var timecode = this.props.timecode
        this.props.timecodeClick(this.props.timecode);
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
            var editReply = this._saveReplyEdit;
            var deleteReply = this._deleteComment; 
            var repliesArr = this.props.children;
            var replyNodes = repliesArr.map(function(reply){
                return (
                    <ReplyContainer
                        id={reply.id}
                        key={reply.id}
                        author={reply.owner.email}
                        value={reply.body}
                        created={reply.created}
                        toggleReply={this._openReply}
                        replyIsOpen={this.state.replyOpen}
                        isReply={true}
                        editReply={editReply} 
                        deleteReply={deleteReply} />
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
                        value={this.state.commentBody}
                        timecode={formattedTime}
                        isReply={false}
                        created={this.props.created} 
                        handleChange={this._handleCommentChange}
                        handleSubmit={this._saveEdit}
                        cancelChange={this._cancelEdit}
                        timecodeClick={this._timecodeClick} />
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
                        created={this.props.created} 
                        editComment={this._setEditMode} 
                        deleteComment={this._deleteComment}
                        toggleReply={this._openReply}
                        replyIsOpen={this.state.replyOpen}
                        timecodeClick={this._timecodeClick}
                        newComment={this.state.newComment} />
                    {replyNodes}
                    {replyForm}
                    {deleteCommentModal}
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
                        created={this.props.created} 
                        toggleReply={this._openReply}
                        replyIsOpen={this.state.replyOpen}
                        timecodeClick={this._timecodeClick}
                        newComment={this.state.newComment} />
                    {replyNodes}
                    {replyForm}
                </div>
            );   
        }
    }

});

module.exports = CommentContainer;
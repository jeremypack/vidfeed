var React = require('react');

var Comment = require('../components/Comment');
var EditComment = require('../components/EditComment');

var ReplyContainer = React.createClass({
    
    propTypes: {
        id:             React.PropTypes.number.isRequired,
        author:         React.PropTypes.string.isRequired,
        value:          React.PropTypes.string.isRequired,
        isReply:        React.PropTypes.bool.isRequired,
        created:        React.PropTypes.string.isRequired,
        editReply:      React.PropTypes.func,
        deleteReply:    React.PropTypes.func
    },

    getInitialState: function() {
        return {
            editable: false,
            commentActions:false,
            replyBody: this.props.value
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
            replyBody: this.props.value
        });
    },

    _saveEdit: function (e) {
        e.preventDefault();
        var replyId = $(e.currentTarget).closest('.c-comment').data('id');
        this.props.editReply(replyId, this.props.author, this.state.replyBody);
        this.setState({
            editable:false
        });
    },

    _deleteReply: function (e) {
        e.preventDefault();
        var replyId = $(e.currentTarget).closest('.c-comment').data('id');
        this.props.deleteReply(replyId);
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
                    value={this.state.replyBody}
                    isReply={this.props.isReply}
                    created={this.props.created} 
                    editComment={this._setEditMode} 
                    deleteComment={this._deleteReply} />
            );

        } else {
            return (
                <Comment
                    id={this.props.id}
                    author={this.props.author}
                    value={this.state.replyBody}
                    isReply={this.props.isReply}
                    created={this.props.created} />
            );   
        }
    }

});

module.exports = ReplyContainer;
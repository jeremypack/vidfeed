var React = require('react');

var Comment = require('../components/Comment');
var EditComment = require('../components/EditComment');

var CommentContainer = React.createClass({
    
    getInitialState: function() {
        return {editable: false, commentBody: this.props.body};
    },

    setEditMode: function(e) {
        e.preventDefault();
        this.setState({editable:true});
    },

    formattedTime: function (time) {
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

    cancelEdit: function(e){
        e.preventDefault();
        this.setState({editable:false, commentBody: this.props.body});
    },

    saveEdit: function (e) {
        e.preventDefault();
        var commentId = $(e.currentTarget).closest('.comment').data('id');
        this.props.handleCommentEdit(commentId, this.props.author, this.state.commentBody);
        this.setState({editable:false});
    },

    deleteComment: function (e) {
        e.preventDefault();
        var commentId = $(e.currentTarget).closest('.comment').data('id');
        this.props.handleDeleteComment(commentId);
    },

    handleCommentChange: function (e) {
        this.setState({commentBody: e.target.value});
    },

    render: function() {
        var formattedTime = this.formattedTime(this.props.timecode);
        if (this.state.editable) {
            return (
                <EditComment 
                    id={this.props.id}
                    value={this.state.commentBody}
                    handleChange={this.handleCommentChange}
                    saveChange={this.saveEdit}
                    cancelChange={this.cancelEdit} />
            );
        } else {
            return (
                <Comment
                    id={this.props.id}
                    parentCommentId={this.props.parentCommentId}
                    author={this.props.author}
                    value={this.state.commentBody}
                    timecode={formattedTime}
                    created={this.props.time} 
                    editComment={this.setEditMode} 
                    deleteComment={this.deleteComment} />
            );   
        }
    }

});

module.exports = CommentContainer;
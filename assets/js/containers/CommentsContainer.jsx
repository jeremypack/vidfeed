var React = require('react');

var CommentFormContainer = require('./CommentFormContainer');
var CommentContainer = require('./CommentContainer');

var CommentsContainer = React.createClass({
    
    getInitialState: function() {
        return {data: []};
    },

    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    handleCommentSubmit: function(comment) {
        var timecode = this.props.timecode;
        comment.timecode = timecode;
        console.log(comment,'comment');
        
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(data) {
                console.log(JSON.parse(data.responseText),'handleCommentSubmit error');
            }.bind(this)
        });
    },

    handleCommentEdit: function(commentId, author, text){
        $.ajax({
            url: this.props.url + '/' + commentId,
            dataType: 'json',
            context: this,
            type: 'PUT',
            data: {body: text, author: author},
            success: function() {
                // budget reload from server instead of updating
                // actual list
                this.loadCommentsFromServer();
            }
        });
    },

    handleDeleteComment: function (commentId) {
        $.ajax({
            url: this.props.url + '/' + commentId,
            dataType: 'json',
            context: this,
            type: 'DELETE',
            success: function() {
                this.loadCommentsFromServer();
            }
        });
    },

    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function() {
        var editHandler = this.handleCommentEdit;
        var deleteHandler = this.handleDeleteComment;
        var commentNodes = this.state.data.map(function(comment) {
            return (
                <CommentContainer 
                    author={comment.owner.email}
                    id={comment.id}
                    key={comment.id}
                    body={comment.body}
                    time={comment.created}
                    timecode={comment.timecode}
                    handleCommentEdit={editHandler}
                    handleDeleteComment={deleteHandler} />
            );
        });
        return (
            <div className="commentBox">
                <CommentFormContainer onCommentSubmit={this.handleCommentSubmit} />
                <h2>Comments {commentNodes.length} </h2>
                <div className="commentList">
                    {commentNodes}
                </div>
            </div>
        );
    }

});

module.exports = CommentsContainer;
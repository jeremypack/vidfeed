var React = require('react');

var CommentContainer = require('./CommentContainer');

var CommentsContainer = React.createClass({
    
    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this._loadCommentsFromServer();
        setInterval(this._loadCommentsFromServer, this.props.pollInterval);
    },

    _loadCommentsFromServer: function() {
        $.ajax({
            url: '/api/feeds/' + this.props.feedId + '/comments',
            dataType: 'json',
            cache: false,
            success: function(data) {
                data.sort(function(a, b) {
                    return parseFloat(a.timecode) - parseFloat(b.timecode);
                });
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    _handleCommentEdit: function(commentId, author, text){
        $.ajax({
            url: '/api/feeds/' + this.props.feedId + '/comments/' + commentId,
            dataType: 'json',
            context: this,
            type: 'PUT',
            data: {body: text, author: author},
            success: function() {
                this._loadCommentsFromServer();
            }
        });
    },

    _handleDeleteComment: function (commentId) {
        $.ajax({
            url: '/api/feeds/' + this.props.feedId + '/comments/' + commentId,
            dataType: 'json',
            context: this,
            type: 'DELETE',
            success: function() {
                this._loadCommentsFromServer();
            }
        });
    },

    render: function() {
        var editHandler = this._handleCommentEdit;
        var deleteHandler = this._handleDeleteComment;
        var replyHandler = this._handleCommentSubmit;
        var feedId = this.props.feedId;
        var noComments = <div className="c-commentList__no-comments">No comments yet :(<br />Be the first!</div>;
        var commentNodes = this.state.data.map(function(comment) {
            return (
                <CommentContainer 
                    feedId = {feedId}
                    author={comment.owner.email}
                    id={comment.id}
                    parentCommentId={comment.parent_id}
                    key={comment.id}
                    body={comment.body}
                    time={comment.created}
                    timecode={comment.timecode}
                    children={comment.children}
                    handleCommentEdit={editHandler}
                    handleDeleteComment={deleteHandler} />
            );
        });
        var commentCount = <h3><strong>{commentNodes.length}</strong> { commentNodes.length === 1 ? 'Comment' : 'Comments' }</h3>;
        return (
            <section className="c-commentList__outer">
                <div className="c-commentList__count lede">
                    {commentNodes.length ? commentCount : null }
                </div>
                <div className="c-commentList">
                    {commentNodes.length ? commentNodes : noComments }
                </div>
            </section>
        );
    }

});

module.exports = CommentsContainer;
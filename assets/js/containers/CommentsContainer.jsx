var React = require('react');

var CommentContainer = require('./CommentContainer');

var CommentsContainer = React.createClass({
    
    propTypes: {
        pollInterval:           React.PropTypes.number.isRequired,
        windowHeight:           React.PropTypes.number,
        feedId:                 React.PropTypes.string.isRequired,
        modalOpen:              React.PropTypes.func.isRequired,
        modalClose:              React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            data: [],
            commentListHeight:''
        };
    },

    componentDidMount: function() {
        this._loadCommentsFromServer();
        this.commentsInterval = setInterval(this._loadCommentsFromServer, this.props.pollInterval);
    },

    componentWillUnmount: function() {
        clearInterval(this.commentsInterval);
    },

    _setCommentsHeight: function() {
        this.setState({
            commentListHeight:''
        });
        var commentListSpace = this.props.windowHeight - this.refs.commentCount.clientHeight;
        if (this.refs.commentList.clientHeight > commentListSpace) {
            this.setState({
                commentListHeight:commentListSpace
            });
        }
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
                this._setCommentsHeight();
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
        var noComments = <div className="c-commentList__no-comments">No comments yet <span className="nowrap">:(</span><br />Be the first!</div>;
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
                    handleDeleteComment={deleteHandler}
                    modalOpen={this.props.modalOpen}
                    modalClose={this.props.modalClose} />
            );
        }.bind(this));
        var commentCount = <h3><strong>{commentNodes.length}</strong> { commentNodes.length === 1 ? 'Comment' : 'Comments' }</h3>;
        
        if (this.state.commentListHeight) {
                var commentListStyle = {
                height:this.state.commentListHeight,
                overflowY:'scroll'
            }
        }
        
        return (
            <section className="c-commentList__outer">
                <div ref="commentCount" className="c-commentList__count lede">
                    {commentNodes.length ? commentCount : null }
                </div>
                <div ref="commentList" className="c-commentList" style={commentListStyle}>
                    {commentNodes.length ? commentNodes : noComments }
                </div>
            </section>
        );
    }

});

module.exports = CommentsContainer;
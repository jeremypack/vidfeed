var React = require('react');

var Comment = React.createClass({
    render: function() {
        var replyToggleText = this.props.showReply ? 'hide reply' : 'reply';
        return (
            <div className="comment" data-id={this.props.id}>
                <p className="commentAuthor">author: {this.props.author}</p>
                {this.props.isReply ? null : <p>timecode: {this.props.timecode}</p> }
                <p>commented on: {this.props.created}</p>
                <p>comment id: {this.props.id}</p>
                {this.props.isReply ? <p>parent comment id: {this.props.parentCommentId}</p> : null }
                <p>{this.props.value}</p>
                <p>is reply: {this.props.isReply ? 'yes' : 'no'}</p>
                <div>
                    {this.props.isReply ? null : <a onClick={this.props.toggleReply} href="#">{replyToggleText}</a> }
                    <a onClick={this.props.editComment} href="#">edit</a>&nbsp;&nbsp;
                    <a onClick={this.props.deleteComment} href="#">delete</a>
                </div>
            </div>
        );
    }

});

module.exports = Comment;
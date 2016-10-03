var React = require('react');

var Comment = React.createClass({
    render: function() {
        var replyToggleText = this.props.showReply ? 'hide reply' : 'reply';
        var replyClass = this.props.isReply ? 'c-comment c-comment--reply' : 'c-comment';
        return (
            <article className={replyClass} data-id={this.props.id}>
                <div className="u-clearfix">
                    <p className="c-comment__author">{this.props.author}</p>
                    {this.props.isReply ? null : <p className="c-comment__timecode">{this.props.timecode}</p> }
                </div>
                <p>{this.props.value}</p>
                <p>
                    {this.props.isReply ? null : <a onClick={this.props.toggleReply} href="#">{replyToggleText}</a> }&nbsp;&nbsp;
                    <a onClick={this.props.editComment} href="#">edit</a>&nbsp;&nbsp;
                    <a onClick={this.props.deleteComment} href="#">delete</a>
                </p>
            </article>
        );
    }

});

module.exports = Comment;
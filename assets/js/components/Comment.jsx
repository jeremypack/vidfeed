var React = require('react');

var Comment = React.createClass({
  
    render: function() {
        return (
            <div className="comment" data-id={this.props.id}>
                <p className="commentAuthor">author: {this.props.author}</p>
                <p>timecode: {this.props.timecode}</p>
                <p>commented on: {this.props.created}</p>
                <p>{this.props.value}</p>
                <div>
                    <a onClick={this.props.editComment} href="#">edit</a>&nbsp;&nbsp;
                    <a onClick={this.props.deleteComment} href="#">delete</a>
                </div>
            </div>
        );
    }

});

module.exports = Comment;
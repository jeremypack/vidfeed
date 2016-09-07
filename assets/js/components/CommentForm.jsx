var React = require('react');

var CommentForm = React.createClass({
    render: function() {
        return (
            <div>
                <h2>Add a comment</h2>
                <form className="commentForm" onSubmit={this.props.handleSubmit}>
                    <input type="text" placeholder="Your name"  onChange={this.props.handleAuthorChange} />
                    <input type="text" placeholder="Say something" onChange={this.props.handleCommentChange} />
                    <input type="number" step="0.01" placeholder="Timestamp" required="true" onChange={this.props.handleTimecodeChange} />
                    <input type="submit" value="Post" />
                </form>
            </div>
        );
    }
});

module.exports = CommentForm;
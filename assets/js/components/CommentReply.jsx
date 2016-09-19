var React = require('react');

var CommentReply = React.createClass({

    render: function() {
        return (
            <div>
                <form className="replyCommentForm" onSubmit={this.props.submitHandler}>
                    <input type="text" placeholder="Write a reply" value={this.props.value} onChange={this.props.changeHandler} />
                    <input type="submit" value="Leave reply"/>
                </form>
            </div>
        );
    }

});

module.exports = CommentReply;
var React = require('react');

var ReplyForm = React.createClass({
    render: function() {
        return (
            <div>
                <form className="replyForm" onSubmit={this.props.handleReplySubmit}>
                    <input type="text" placeholder="Write a reply" value={this.props.comment} onChange={this.props.handleReplyChange} />
                    <input type="submit" value="Leave reply"/>
                </form>
            </div>
        );
    }
});

module.exports = ReplyForm;
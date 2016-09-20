var React = require('react');

var ReplyForm = React.createClass({
    render: function() {
        return (
            <div>
                <form className="replyForm" onSubmit={this.props.handleSubmit}>
                    <p>{this.props.parentId}</p>
                    <input type="text" placeholder="Your name"  onChange={this.props.handleAuthorChange} />
                    <input type="text" placeholder="Write a reply" value={this.props.value} onChange={this.props.handleReplyChange} />
                    <input type="submit" value="Leave reply"/>
                </form>
            </div>
        );
    }
});

module.exports = ReplyForm;
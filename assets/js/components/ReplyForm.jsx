var React = require('react');
var classNames = require('classnames');

var ReplyForm = React.createClass({
    
    componentDidMount: function() {
        this.refs.replyInput.focus();
    },

    render: function() {
        
        var submitClasses = classNames({
            'o-btn o-btn--secondary o-btn--small':true,
            'o-btn--disabled':!this.props.isValid
        });

        return (
            <div className="u-padding-small u-padding-top-none">
                <form className="form--border replyForm" onSubmit={this.props.handleReplySubmit}>
                    <div className="input-with-button">
                        <input type="text" ref="replyInput" placeholder="Write a reply" value={this.props.comment} onChange={this.props.handleReplyChange} className="input--border" />
                        <input type="submit" className={submitClasses} value="Reply" />
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = ReplyForm;
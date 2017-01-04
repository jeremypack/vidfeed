import React from 'react';
import classNames from 'classnames';

const ReplyForm = React.createClass({
    
    propTypes: {
        isValid:            React.PropTypes.bool,
        handleReplySubmit:  React.PropTypes.func.isRequired,
        comment:            React.PropTypes.string,
        handleReplyChange:  React.PropTypes.func.isRequired
    },

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
                        <input onClick={this.props.handleReplySubmit} type="submit" className={submitClasses} value="Reply" />
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = ReplyForm;
var React = require('react');
var classNames = require('classnames');

var CommentForm = React.createClass({
    
    propTypes: {
        timecode:               React.PropTypes.any.isRequired,
        handleCommentChange:    React.PropTypes.func.isRequired,
        handleKeyPress:         React.PropTypes.func.isRequired,
        handleSubmit:           React.PropTypes.func.isRequired,
        returnToSubmitBool:     React.PropTypes.bool.isRequired,
        returnToSubmitSwitch:   React.PropTypes.func.isRequired,
        body:                   React.PropTypes.string.isRequired,
        isValid:                React.PropTypes.bool
    },

    render: function() {
        
        var submitClasses = classNames({
            'c-commentForm__submit o-btn o-btn--primary':true,
            'o-btn--disabled':!this.props.isValid
        });

        return (
            <section className="c-commentForm">
                <p className="c-commentForm__timecode">{this.props.timecode}</p>
                <form className="c-commentForm__form" onSubmit={this.props.handleSubmit}>
                    <textarea placeholder="Add a comment…" value={this.props.body} className="c-commentForm__input" onChange={this.props.handleCommentChange} onKeyPress={this.props.handleKeyPress}></textarea>
                    <div className="c-commentForm__actions">
                        <label className="label-with-input c-commentForm__returnToSubmit"><input type="checkbox" checked={this.props.returnToSubmitBool} name="returnToSubmit" onChange={this.props.returnToSubmitSwitch} />&apos;Enter&apos; key submits comment</label>
                        <input type="submit" className={submitClasses} value="Comment" />
                    </div>
                </form>
            </section>
        );
    }
});

module.exports = CommentForm;
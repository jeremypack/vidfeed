var React = require('react');
var classNames = require('classnames');

var CommentForm = React.createClass({
    render: function() {
        
        var submitClasses = classNames({
            'form--single__submit o-btn o-btn--primary':true,
            'o-btn--disabled':!this.props.isValid
        });

        return (
            <section className="c-commentForm">
                <p className="c-commentForm__timecode">{this.props.timecode}</p>
                <form className="form--single c-commentForm__form" onSubmit={this.props.handleSubmit}>
                    <div className="o-layout o-layout--flush">
                        <div className="o-layout__item u-4/5@tablet">
                            <textarea placeholder="Add a comment" value={this.props.body} className="form--single__input" onChange={this.props.handleCommentChange}></textarea>
                        </div>
                        <div className="o-layout__item u-1/5@tablet">
                            <input type="submit" className={submitClasses} value="Comment" />
                        </div>
                    </div>
                </form>
            </section>
        );
    }
});

module.exports = CommentForm;
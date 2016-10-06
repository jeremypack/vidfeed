var React = require('react');

var CommentForm = React.createClass({
    render: function() {
        return (
            <section className="c-commentForm">
                <p className="c-commentForm__timecode">{this.props.timecode}</p>
                <form className="form--single c-commentForm__form" onSubmit={this.props.handleSubmit}>
                    <div className="o-layout o-layout--flush">
                        <div className="o-layout__item u-4/5@tablet">
                            <textarea placeholder="Add a comment" value={this.props.body} className="form--single__input" onChange={this.props.handleCommentChange}></textarea>
                        </div>
                        <div className="o-layout__item u-1/5@tablet">
                            <input type="submit" className="form--single__submit o-btn o-btn--primary" value="Comment" />
                        </div>
                    </div>
                </form>
            </section>
        );
    }
});

module.exports = CommentForm;
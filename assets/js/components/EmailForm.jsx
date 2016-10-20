var React = require('react');
var classNames = require('classnames');

var EmailForm = React.createClass({
    
    render: function() {
        if (this.props.submitted) {
            return (
                <div>{this.props.submittedMsg}</div>
            )
        }

        var submitClasses = classNames({
            'o-btn o-btn--primary':true,
            'o-btn--disabled':!this.props.isValid
        });

        return (
            <div className="modal__content">
                <div className="modal__header">
                    <h3 className="modal__title">{this.props.heading}</h3>
                    <a href="#" onClick={this.props.closeModal} className="modal__close">×<span className="u-hidden-visually">Close</span></a>
                </div>
                <form className="form--border" onSubmit={this.props.handleSubmit}>
                    <div className="u-padding-small u-padding-top">
                        <input type="email" placeholder="Email address" value={this.props.value} onChange={this.props.handleChange} className="input--border" />
                    </div>
                    <div className="text--center u-padding u-padding-top-small">
                        <input type="submit" className={submitClasses} value="Submit" />
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = EmailForm;
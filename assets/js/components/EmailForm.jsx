var React = require('react');
var classNames = require('classnames');

var EmailForm = React.createClass({
    
    propTypes: {
        heading:        React.PropTypes.string.isRequired,
        closeModal:     React.PropTypes.func,
        isValid:        React.PropTypes.bool,
        handleSubmit:   React.PropTypes.func.isRequired,
        value:          React.PropTypes.string.isRequired,
        text:           React.PropTypes.string,
        submitted:      React.PropTypes.bool,
        submittedMsg:   React.PropTypes.string
    },

    render: function() {
        if (this.props.submitted) {
            return (
                <div className="modal__content">
                    <div className="modal__header">
                        <h3 className="modal__title">{this.props.heading}</h3>
                        <a href="#" onClick={this.props.closeModal} className="modal__close">×<span className="u-hidden-visually">Close</span></a>
                    </div>
                    <div className="u-padding-small u-padding-top">
                        <p>{this.props.submittedMsg}</p>
                    </div>
                </div>
            );
        }

        if (this.props.text) {
            var extraText =     <div className="u-padding-small u-padding-top u-padding-bottom-none">
                                    <p className="u-margin-bottom-none">{this.props.text}</p>
                                </div>;
                                
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
                {extraText}
                <form className="form--border" onSubmit={this.props.handleSubmit}>
                    <div className="u-padding-small u-padding-top">
                        <label htmlFor="email" className="u-hidden-visually">Email address</label>
                        <input id="email" type="email" placeholder="Email address" value={this.props.value} onChange={this.props.handleChange} className="input--border" />
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
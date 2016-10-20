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
            <div>
                <a href="#" onClick={this.props.closeModal}>Close</a>
                <h2>{this.props.heading}</h2>
                <form className="ownFeed" onSubmit={this.props.handleSubmit}>
                    <input type="email" placeholder="Your email" value={this.props.value} onChange={this.props.handleChange} />
                    <input type="submit" className={submitClasses} value="Submit" />
                </form>
            </div>
        );
    }
});

module.exports = EmailForm;
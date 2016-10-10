var React = require('react');

var EmailForm = React.createClass({
    
    render: function() {
        if (this.props.submitted) {
            return (
                <div>{this.props.submittedMsg}</div>
            )
        }
        return (
            <div>
                <a href="#" onClick={this.props.closeModal}>Close</a>
                <h2>{this.props.heading}</h2>
                <form className="ownFeed" onSubmit={this.props.handleSubmit}>
                    <input type="email" placeholder="Your email" value={this.props.value} onChange={this.props.handleChange} />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
});

module.exports = EmailForm;
var React = require('react');

var OwnFeed = React.createClass({
    
    render: function() {
        if (this.props.submitted) {
            return (
                <div>feed owned by {this.props.owner}.</div>
            )
        }
        return (
            <div className={this.props.hidden}>
                <h2>Own this feed</h2>
                <form className="ownFeed" onSubmit={this.props.handleSubmit}>
                    <input type="email" placeholder="Your email" value={this.props.owner} onChange={this.props.handleChange} />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
});

module.exports = OwnFeed;
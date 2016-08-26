var React = require('react');

var OwnFeed = React.createClass({
    handleOwnerChange: function(e) {
        this.setState({owner: e.target.value});
    },
    handleSubmit: function() {

    },
    getInitialState : function () {
        return({hidden : "hidden"});
    },
    componentWillMount : function () {
        var that = this;
        setTimeout(function() {
            that.show();
        }, that.props.wait);
    },
    show : function () {
        this.setState({hidden : ""});
    },
    render: function() {
        return (
            <div className={this.state.hidden}>
                <h2>Own this feed</h2>
                <form className="ownFeed" onSubmit={this.handleSubmit}>
                    <input type="email" placeholder="Your email" value={this.state.owner} onChange={this.handleOwnerChange} />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
});

module.exports = OwnFeed;
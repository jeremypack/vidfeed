var React = require('react');

var OwnFeed = require('../components/OwnFeed');

var OwnFeedContainer = React.createClass({
    
    getInitialState : function () {
        return{ hidden : "hidden", owner:'', feedId: this.props.feedId };
    },

    handleOwnerChange: function(e) {
        this.setState({owner: e.target.value});
    },

    handleSubmit: function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            context: this,
            url: "/api/feeds/" + this.state.feedId + '/set-owner/',
            data: {
                owner: this.state.owner,
            },
            success: function (ev){
                console.log(this.state.owner,'this.state.owner');
                console.log(this.state.feedId,'this.state.feedId');
            },
            error: function (ev) {
                console.log(this.state.owner,'this.state.owner');
                console.log(this.state.feedId,'this.state.feedId');
            }
        });
    },

    componentWillMount : function () {
        var that = this;
        // timeout removes hidden class
        setTimeout(function() {
            that.show();
        }, that.props.wait);
    },

    show : function () {
        this.setState({hidden : ""});
    },

    render : function() {
        return (
            <div>
                <OwnFeed
                    hidden={this.state.hidden}
                    handleSubmit={this.handleSubmit}
                    owner={this.state.owner}
                    handleChange={this.handleOwnerChange} />
            </div>
        );
        
    }
});

module.exports = OwnFeedContainer;
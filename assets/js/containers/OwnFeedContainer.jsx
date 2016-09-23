var React = require('react');

var OwnFeed = require('../components/OwnFeed');

var OwnFeedContainer = React.createClass({
    
    getInitialState : function () {
        return {
            hidden : true,
            owner:'',
            submitted: false,
            feedId: this.props.feedId 
        };
    },

    componentDidMount: function() {
        console.log('mounting own feed');
        var that = this;
        // timeout removes hidden class
        setTimeout(function() {
            that.show();
        }, that.props.wait);
    },

    _handleOwnerChange: function(e) {
        this.setState({owner: e.target.value});
    },

    _handleSubmit: function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            context: this,
            url: "/api/feeds/" + this.state.feedId + '/set-owner/',
            data: {
                owner: this.state.owner,
            },
            success: function (ev){
                this.setState({
                    hidden:'hidden',
                    submitted:true
                });
            },
            error: function (ev) {
                console.log(this.state.owner,'this.state.owner');
                console.log(this.state.feedId,'this.state.feedId');
            }
        });
    },

    show : function () {
        this.setState({hidden : false});
    },

    render : function() {
        return (
            <div>
                <OwnFeed
                    hidden={this.state.hidden}
                    handleSubmit={this._handleSubmit}
                    owner={this.state.owner}
                    handleChange={this._handleOwnerChange}
                    submitted={this.state.submitted} />
            </div>
        );
        
    }
});

module.exports = OwnFeedContainer;
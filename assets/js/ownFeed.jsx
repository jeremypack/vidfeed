var React = require('react');

var OwnFeed = React.createClass({
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
          url: "/api/feeds/setOwner",
          data: {
            owner: this.state.owner,
            feedId: this.state.feedId
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
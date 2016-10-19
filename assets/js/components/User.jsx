var React = require('react');

var User = React.createClass({
    render:function() {
        return (
            <div className="float--right">
                
                <p>{this.props.userEmail}</p>
            </div>
        );
    } 
});

module.exports = User;
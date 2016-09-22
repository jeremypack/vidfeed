var React = require('react');

var InviteesList = React.createClass({
    
    remove: function(item) {
        return function(e) {
            e.preventDefault();
            return this.props.onRemove(item);
        }.bind(this);
    },

    render: function() {
        var that = this;
        var emailsArr = this.props.list;
        var emailNodes = emailsArr.map(function(email, i){
            return (
                <li key={i}>{email}<a href="#" onClick={that.remove(email)}>Remove</a></li>
            );
        });
        return (
            <div>
                <p>Collaborators</p>
                <ul>
                    {emailNodes}
                </ul>
            </div>
        );
    }

});

module.exports = InviteesList;
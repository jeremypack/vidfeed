var React = require('react');

var User = React.createClass({
    
    propTypes: {
        userEmail:      React.PropTypes.string.isRequired,
        removeUser:     React.PropTypes.bool,
        removeFunc:     React.PropTypes.func,
        iconOnly:       React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            firstLetter:''
        };
    },

    getDefaultProps: function() {
        return {
            iconOnly:false
        };
    },

    componentDidMount:function() {
        var firstLetter = this.props.userEmail.charAt(0);
        this.setState({
            firstLetter:firstLetter
        });
    },

    render:function() {
        
        if (this.props.removeUser) {
            var user = this.props.userEmail;
            var removeAction = <a href="#" className="user__remove" onClick={this.props.removeFunc(user)}>×<span className="u-hidden-visually">Remove</span></a>;
        }

        if (this.props.iconOnly) {
            return (
                <div className="user user--iconOnly">
                    <span className="user__icon">{this.state.firstLetter}</span>
                </div>
            );
        }

        return (
            <div className="user">
                <span className="user__icon">{this.state.firstLetter}</span>
                <span className="user__title">{this.props.userEmail}</span>
                {removeAction}
            </div>
        );
    }

});

module.exports = User;
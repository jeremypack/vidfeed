var React = require('react');
var classNames = require('classnames');

var User = React.createClass({
    
    propTypes: {
        userEmail:      React.PropTypes.string,
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

        var iconClass = 'user__icon pastelSwatch--'+this.props.swatchNumber;

        if (this.props.removeUser) {
            var user = this.props.userEmail;
            var removeAction = <a href="#" className="user__remove" onClick={this.props.removeFunc(user)}>×<span className="u-hidden-visually">Remove</span></a>;
        }

        if (this.props.iconOnly) {
            return (
                <div className="user user--iconOnly">
                    <span className={iconClass}>{this.state.firstLetter}</span>
                    <div className="user__email">{this.props.userEmail}</div>
                </div>
            );
        }

        return (
            <div className="user">
                <span className={iconClass}>{this.state.firstLetter}</span>
                <span className="user__title">{this.props.userEmail}</span>
                {removeAction}
            </div>
        );
    }

});

module.exports = User;
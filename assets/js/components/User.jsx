import React from 'react';
import classNames from 'classnames';

function swatchNumber(id) {
    return (id * 3 % 501) + 1;
}

const User = React.createClass({
    
    propTypes: {
        id:             React.PropTypes.number,
        userEmail:      React.PropTypes.string,
        removeUser:     React.PropTypes.bool,
        removeFunc:     React.PropTypes.func,
        iconOnly:       React.PropTypes.bool,
        onClick:        React.PropTypes.func
    },

    getInitialState: function() {
        return {
            firstLetter:'',
            swatchNumber:''
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
            firstLetter:firstLetter,
            swatchNumber: swatchNumber(parseInt(this.props.id),10)
        });
    },

    componentWillReceiveProps:function(nextProps) {
        if (nextProps.id != this.props.id) {
            var firstLetter = nextProps.userEmail.charAt(0);
            this.setState({
                firstLetter:firstLetter,
                swatchNumber: swatchNumber(parseInt(nextProps.id),10)
            });
        }
    },

    render:function() {

        var iconClass = 'user__icon pastelSwatch--'+this.state.swatchNumber;

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
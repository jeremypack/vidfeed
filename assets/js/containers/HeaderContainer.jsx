import React from 'react';

import Header from '../components/Header';

const HeaderContainer = React.createClass({
    
    propTypes: {
        isHomepage:         React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            sessionUser:'',
            sessionUserId:undefined
        };
    },

    componentDidMount:function() {
        var getSessionUser = function() {
            if (window.vidfeed.user.email) {
                this.setState({
                    sessionUser:window.vidfeed.user.email,
                    sessionUserId:window.vidfeed.user.id
                });
            } 
        }.bind(this);
        this.sessionCheckInterval = setInterval(getSessionUser,1000);
    },

    componentWillUnmount:function(){
        clearInterval(this.sessionCheckInterval);
    },

    render: function() {
        return (
            <Header
                isHomepage={this.props.isHomepage}
                sessionUser={this.state.sessionUser}
                sessionUserId={this.state.sessionUserId} />
        );
    }

});

module.exports = HeaderContainer;
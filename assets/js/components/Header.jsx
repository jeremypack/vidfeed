import React from 'react';

import { Router, Route, Link, browserHistory } from 'react-router';

const User = require('./User');

const Header = React.createClass({

    propTypes: {
        isHomepage:             React.PropTypes.bool
    },

    getInitialState:function() {
        return {
            sessionUser:'',
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
        if (this.props.isHomepage) {
            var logo = window.vidfeed.images_dir + '/logo-white.svg';
            return (
                <header className="header header--home">
                    <div className="o-wrapper">
                        <div className="logo">
                            <Link to="/" className="logo__link">
                                <img src={logo} alt="Vidfeed" />
                            </Link>
                        </div>
                    </div>
                </header>
            );
        }

        var logo = window.vidfeed.images_dir + '/logo-black.svg';

        if (this.state.sessionUser) {
            var displayUser = <User id={this.state.sessionUserId} userEmail={this.state.sessionUser} />
        }

        return (
            <header className="header u-clearfix">
                <div className="logo">
                    <Link to="/" className="logo__link">
                        <img src={logo} alt="Vidfeed" />
                    </Link>
                </div>
                <div className="float--right">
                    {displayUser}
                </div> 
            </header>
        );
    }

});

module.exports = Header;
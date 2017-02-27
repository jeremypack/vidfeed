import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

import User from '../components/User';

const NavigationContainer = React.createClass({

     propTypes: {
        isHomepage:             React.PropTypes.bool
    },

    getInitialState:function(){
        return {
            sessionUser:'',
            sessionUserId:undefined
        };
    },

    componentWillMount:function(){
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

    componentDidMount:function(){

    },

    componentWillUnmount: function() {
        clearInterval(this.sessionCheckInterval);
    },

    render:function() {
        
        if (this.props.isHomepage && !this.state.sessionUser) {
            return (
                <nav className="nav">
                    <ul className="o-list-inline"> 
                        <li className="o-list-inline__item"><Link className="nav__link" to="/app/login">Login</Link></li>
                        <li className="o-list-inline__item"><Link className="o-btn o-btn--ghost"to="/app/register">Get Plus!</Link></li>
                    </ul>
                </nav>
            );
        }

        if (!this.props.isHomepage && !this.state.sessionUser) {
            return false;
        }

        return (
            <div className="nav">
                <User id={this.state.sessionUserId} userEmail={this.state.sessionUser} />
            </div>
        );
        
    }

});

module.exports = NavigationContainer;
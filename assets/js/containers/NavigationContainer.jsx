import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import classNames from 'classnames';

import User from '../components/User';

const NavigationContainer = React.createClass({

     propTypes: {
        isHomepage:             React.PropTypes.bool,
        mouseOut:               React.PropTypes.bool
    },

    getInitialState:function(){
        return {
            sessionUser:'',
            sessionUserId:undefined,
            show:false,
            subnavBtnShowing:true, // opacity
            subnavShowing:false
        };
    },

    componentWillMount:function(){
        var getSessionUser = function() {
            if (window.vidfeed.user.email) {
                this.setState({
                    sessionUser:window.vidfeed.user.email,
                    sessionUserId:window.vidfeed.user.id,
                    show:true
                });
            } else {
                this.setState({
                    show:true
                });
            }
        }.bind(this);
        this.sessionCheckInterval = setInterval(getSessionUser,1000);
    },

    componentWillUnmount: function() {
        clearInterval(this.sessionCheckInterval);
    },

    componentWillReceiveProps:function(nextProps) {
        if (nextProps.mouseOut && this.state.subnavShowing) {
            this._toggleSubnav();
        }
    },

    _toggleSubnav:function(){
        if (!this.state.subnavShowing) {
            this.setState({
                subnavBtnShowing:false
            }, function(){
                setTimeout(function(){
                    this.setState({
                        subnavShowing:true
                    })
                }.bind(this),300)
            });
        } else {
            this.setState({
                subnavShowing:false
            }, function(){
                setTimeout(function(){
                    this.setState({
                        subnavBtnShowing:true
                    })
                }.bind(this),300)
            });
        }
    },

    render:function() {

        var navClasses = classNames({
            'nav':true,
            'nav--loggedIn':this.state.sessionUser,
            'nav--home':this.props.isHomepage,
            'nav--subnavShowing':this.state.subnavShowing
        });

        if (this.props.isHomepage && !this.state.sessionUser && this.state.show) {
            return (
                <nav className={navClasses}>
                    <ul className="o-list-inline"> 
                        <li className="o-list-inline__item"><Link className="nav__link" to="/app/login">Login</Link></li>
                        <li className="o-list-inline__item"><Link className="o-btn o-btn--ghost"to="/app/register">Get Plus!</Link></li>
                    </ul>
                </nav>
            );
        }
        if (this.state.show) {
            return (
                <div className={navClasses}>
                    <div className="nav__user">
                        <User id={this.state.sessionUserId} userEmail={this.state.sessionUser} />
                    </div>
                    <div className={this.state.subnavBtnShowing ? 'subnav__btn':'subnav__btn subnav__btn--invisible'} onClick={this._toggleSubnav}><i className={this.props.isHomepage ? 'icon icon--menuWhite': 'icon icon--menuBlack'}></i></div>
                    <div className={this.state.subnavShowing ? 'subnav subnav--open': 'subnav'}>
                        <ul className="o-list-inline">
                            <li className="o-list-inline__item"><Link className="subnav__link" to="/app/account">Account</Link></li>
                            <li className="o-list-inline__item"><Link className="subnav__link" to="/app/login">Logout</Link></li>
                        </ul>
                    </div>
                </div>
            );
        }

        return false;
        
    }

});

module.exports = NavigationContainer;
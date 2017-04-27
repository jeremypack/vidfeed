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
            isAuthenticated:false,
            show:false,
            subnavBtnShowing:true, // opacity
            subnavShowing:false,
            mobileNav:false
        };
    },

    componentWillMount:function(){
        var getSessionUser = function() {
            if (window.vidfeed.user.email) {
                this.setState({
                    sessionUser:window.vidfeed.user.email,
                    sessionUserId:window.vidfeed.user.id,
                    isAuthenticated:window.vidfeed.user.isAuthenticated,
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

    componentDidMount:function(){
        this._resizeContent();
        window.addEventListener('resize', this._resizeContent);
    },  

    componentWillUnmount: function() {
        clearInterval(this.sessionCheckInterval);
        window.removeEventListener('resize', this._resizeContent);
    },

    componentWillReceiveProps:function(nextProps) {
        if (nextProps.mouseOut && this.state.subnavShowing && !this.state.mobileNav) {
            this._toggleSubnav();
        }
    },

    _resizeContent:function() {
        if (window.innerWidth <= 550) {
            this.setState({
                mobileNav:true
            });
        } else {
            this.setState({
                mobileNav:false
            });
        }
    },

    _logout:function(){
        $.ajax({
            type: 'post',
            url: '/api/profile/logout',
            success: function (data) {
                window.vidfeed.user.isAuthenticated = false;
                window.vidfeed.user.email = '';
                window.vidfeed.user.id = undefined;
                this.setState({
                    sessionUser:'',
                    sessionUserId:undefined,
                    isAuthenticated:window.vidfeed.user.isAuthenticated,
                });
                browserHistory.push('/');
            }.bind(this),
            error: function (data) {
                console.log(data);
            }
        });
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
                }.bind(this),50)
            });
        } else {
            this.setState({
                subnavShowing:false
            }, function(){
                setTimeout(function(){
                    this.setState({
                        subnavBtnShowing:true
                    })
                }.bind(this),50)
            });
        }
    },

    render:function() {

        var navClasses = classNames({
            'nav':true,
            'nav--loggedIn':this.state.isAuthenticated,
            'nav--home':this.props.isHomepage,
            'nav--subnavShowing':this.state.subnavShowing
        });

        let subnavOptions;
        if (this.state.isAuthenticated) {
            subnavOptions = <ul className={this.state.mobileNav ? 'o-list-bare' : "o-list-inline"}>
                                <li className={this.state.mobileNav ? '' : "o-list-inline__item"}><Link className={this.state.mobileNav ? 'o-btn o-btn--ghost' : "subnav__link"} to="/app/dashboard">Dashboard</Link></li>
                                <li className={this.state.mobileNav ? '' : "o-list-inline__item"}><div className={this.state.mobileNav ? 'o-btn o-btn--ghost' : "subnav__link"} onClick={this._logout}>Logout</div></li>
                            </ul>
        } else {
            subnavOptions = <ul className={this.state.mobileNav ? 'o-list-bare' : "o-list-inline"}>
                                <li className={this.state.mobileNav ? '' : "o-list-inline__item"}><Link className={this.state.mobileNav ? 'o-btn o-btn--ghost' : "subnav__link"} to="/app/login">Login</Link></li>
                                <li className={this.state.mobileNav ? '' : "o-list-inline__item"}><Link className={this.state.mobileNav ? 'o-btn o-btn--ghost' : "subnav__link"} to="/app/register">Sign up</Link></li>
                            </ul>
        }

        let homeNavOptions;
        if (this.state.isAuthenticated) {
            homeNavOptions = <ul className="o-list-inline">
                                <li className="o-list-inline__item"><Link className='o-btn o-btn--ghost' to="/app/dashboard">Dashboard</Link></li>
                                <li className="o-list-inline__item"><div className='o-btn o-btn--ghost' onClick={this._logout}>Logout</div></li>
                            </ul>
        } else {
            homeNavOptions = <ul className="o-list-inline">
                                <li className="o-list-inline__item"><Link className={this.state.mobileNav ? 'o-btn o-btn--ghost' : "nav__link"} to="/app/login">Login</Link></li>
                                <li className="o-list-inline__item"><Link className='o-btn o-btn--ghost' to="/app/register">Sign up</Link></li>
                            </ul>
        }

        if (this.props.isHomepage && this.state.show) {
            return (
                <nav className={navClasses}>
                    {homeNavOptions}
                </nav>
            );
        }

        if (this.state.mobileNav && this.state.show) {
            return (
                <div className={navClasses}>
                    <div className={this.state.subnavBtnShowing ? 'subnav__btn':'subnav__btn subnav__btn--invisible'} onClick={this._toggleSubnav}><i className={this.props.isHomepage ? 'icon icon--menuWhite': 'icon icon--menuBlack'}></i></div>
                    <div className={this.state.subnavShowing ? 'subnav subnav--open': 'subnav'}>
                        <div className="subnav__close" onClick={this._toggleSubnav}><i className="icon icon--crossWhite"></i><span className="u-hidden-visually">Hide comments</span></div>
                        <div className={this.state.isAuthenticated ? "nav__user" : "nav__user u-hidden"}>
                            <User id={this.state.sessionUserId} userEmail={this.state.sessionUser} />
                        </div>
                        {subnavOptions}
                    </div>
                </div>
            );
        }

        if (this.state.show) {
            return (
                <div className={navClasses}>
                    <div className={this.state.isAuthenticated ? "nav__user" : "nav__user u-hidden"}>
                        <User id={this.state.sessionUserId} userEmail={this.state.sessionUser} />
                    </div>
                    <div className={this.state.subnavBtnShowing ? 'subnav__btn':'subnav__btn subnav__btn--invisible'} onClick={this._toggleSubnav}><i className={this.props.isHomepage ? 'icon icon--menuWhite': 'icon icon--menuBlack'}></i></div>
                    <div className={this.state.subnavShowing ? 'subnav subnav--open': 'subnav'}>
                        {subnavOptions}
                    </div>
                </div>
            );
        }

        return false;
        
    }

});

module.exports = NavigationContainer;
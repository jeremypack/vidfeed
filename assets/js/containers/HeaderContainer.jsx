import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

import NavigationContainer from '../containers/NavigationContainer';

const HeaderContainer = React.createClass({
    
    propTypes: {
        isHomepage:         React.PropTypes.bool
    },

    getInitialState:function(){
        return {
            mouseOut:true
        };
    },

    componentDidMount:function() {
        
    },

    componentWillUnmount:function(){
        
    },

    _mouseIn:function(){
        this.setState({
            mouseOut:false
        })
    },

    _mouseOut:function(){
        this.setState({
            mouseOut:true
        })
    },

    render: function() {
        
        let logoLink;

        if (window.vidfeed.user.isAuthenticated) {
            logoLink = '/app/dashboard'
        } else {
            logoLink = '/'
        }

        if (this.props.isHomepage) {
            return (
                <header className='header header--home u-clearfix text--center' onMouseEnter={this._mouseIn} onMouseLeave={this._mouseOut}>
                    <div className="o-wrapper">
                        <div className="logo">
                            <Link to={logoLink} className="logo__link">
                                <img src={window.vidfeed.images_dir + '/logo-white.svg'} alt="Vidfeed" />
                            </Link>
                        </div>
                    </div>
                </header>
            )
        }

        return (
            <header className='header u-clearfix' onMouseEnter={this._mouseIn} onMouseLeave={this._mouseOut}>
                <div className="logo">
                    <Link to={logoLink} className="logo__link">
                        <img src={window.vidfeed.images_dir + '/logo-black.svg'} alt="Vidfeed" />
                    </Link>
                </div>
                <NavigationContainer mouseOut={this.state.mouseOut} />
            </header>
        )
    }

});

module.exports = HeaderContainer;
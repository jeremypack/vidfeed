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
        clearTimeout(this.hoverTimeout);
    },

    _mouseIn:function(){
        this.setState({
            mouseOut:false
        })
        clearTimeout(this.hoverTimeout);
    },

    _mouseOut:function(){
        this.hoverTimeout = setTimeout(function(){
            this.setState({
                mouseOut:true
            })
        }.bind(this), 1500);  
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
                <header className='header header--home u-clearfix' onMouseEnter={this._mouseIn} onMouseLeave={this._mouseOut}>
                    <div className="o-wrapper u-clearfix">
                        <div className="logo">
                            <Link to={logoLink} className="logo__link">
                                <img src={window.vidfeed.images_dir + '/logo-white.svg'} alt="Vidfeed" />
                            </Link>
                        </div>
                        <NavigationContainer isHomepage={true} mouseOut={this.state.mouseOut} />
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
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
        
        if (this.props.isHomepage) {
            return (
                <header className='header header--home u-clearfix' onMouseEnter={this._mouseIn} onMouseLeave={this._mouseOut}>
                    <div className="o-wrapper">
                        <div className="logo">
                            <Link to="/" className="logo__link">
                                <img src={window.vidfeed.images_dir + '/logo-white.svg'} alt="Vidfeed" />
                            </Link>
                        </div>
                        <NavigationContainer mouseOut={this.state.mouseOut} isHomepage={this.props.isHomepage} />
                    </div>
                </header>
            )
        }

        return (
            <header className='header u-clearfix' onMouseEnter={this._mouseIn} onMouseLeave={this._mouseOut}>
                <div className="logo">
                    <Link to="/" className="logo__link">
                        <img src={window.vidfeed.images_dir + '/logo-black.svg'} alt="Vidfeed" />
                    </Link>
                </div>
                <NavigationContainer mouseOut={this.state.mouseOut} />
            </header>
        )
    }

});

module.exports = HeaderContainer;
import React from 'react';

import HeaderContainer from '../containers/HeaderContainer';

const Account = React.createClass({

    getInitialState:function(){
        return {
            windowHeight:undefined
        };
    },

    componentDidMount: function() {
        this._resizeContent();
        window.addEventListener('resize', this._resizeContent);
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this._resizeContent);
    },

    _resizeContent : function() {
        var windowWidth = window.innerWidth;
        if (windowWidth < 740) {
            this.setState({
                windowHeight:undefined
            });
            return;
        }
        var headerHeight = this.refs.header.clientHeight;
        var remainingHeight = window.innerHeight - headerHeight;
        this.setState({
            windowHeight:remainingHeight
        });
    },

    render:function(){
        
        var ScrollPaneStyle = {
            height:this.state.windowHeight,
            overflowY:'scroll'
        }

        return (
            <div>
                <div ref="header">
                    <HeaderContainer />
                </div>
                <div style={ScrollPaneStyle}>
                    <div className="o-wrapper">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Account;
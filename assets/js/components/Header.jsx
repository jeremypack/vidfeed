var React = require('react');

import { Router, Route, Link, browserHistory } from 'react-router';

var User = require('./User');

var Header = React.createClass({

    getInitialState:function() {
        return {
            sessionUser:'',
        };
    },

    componentDidMount:function() {
        var getSessionUser = function() {
            if (window.vidfeed.user.email) {
                this.setState({
                    sessionUser:window.vidfeed.user.email
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
            var displayUser = <User userEmail={this.state.sessionUser} />
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
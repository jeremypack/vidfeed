import React from 'react';

import { Router, Route, Link, browserHistory } from 'react-router';

const User = require('./User');

const Header = React.createClass({

    propTypes: {
        isHomepage:             React.PropTypes.bool,
        sessionUserId:          React.PropTypes.number,
        sessionUser:            React.PropTypes.string,
        showGetPlus:            React.PropTypes.func
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
                        <a href="#" className="o-btn o-btn--ghost float--right" onClick={this.props.showGetPlus}>Got plus?</a>
                    </div>
                </header>
            );
        }

        var logo = window.vidfeed.images_dir + '/logo-black.svg';

        if (this.props.sessionUser) {
            var displayUser = <User id={this.props.sessionUserId} userEmail={this.props.sessionUser} />
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
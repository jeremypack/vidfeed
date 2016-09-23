var React = require('react');

import { Router, Route, Link, browserHistory } from 'react-router';

var Header = React.createClass({

    render: function() {
        console.log(this.props.isHomepage,'isHomepage');
        if (this.props.isHomepage) {
            var logo = window.vidfeed.images_dir + '/logo-white.svg';
            return (
                <header className="header header--home">
                    <div className="container">
                        <div className="logo">
                            <Link to="/" className="logo__link">
                                <img src={logo} alt="Vidfeed" />
                            </Link>
                        </div>
                    </div>
                </header>
            );
        }
        return (
            <header className="header">
                <div className="container">
                    <div className="logo">
                            <Link to="/" className="logo__link">
                                <img src={logo} alt="Vidfeed" />
                            </Link>
                        </div>
                </div>
            </header>
        );
    }

});

module.exports = Header;
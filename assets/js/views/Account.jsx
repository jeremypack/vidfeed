import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

import NavgationContainer from '../containers/NavigationContainer';

const Account = React.createClass({

    render:function(){
        
        return (
            <div>
                <div ref="header">
                    <header className="header u-clearfix">
                        <div className="logo">
                            <Link to="/" className="logo__link">
                                <img src={window.vidfeed.images_dir + '/logo-black.svg'} alt="Vidfeed" />
                            </Link>
                        </div>
                    </header>
                    <NavgationContainer />
                </div>
                <div className="o-wrapper">
                    {this.props.children}
                </div>
            </div>
        );
    }

});

module.exports = Account;
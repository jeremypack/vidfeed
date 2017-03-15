import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

const ForgotPasswordForm = React.createClass({
    
    render:function() {
        return (
            <form onSubmit={this.props.onSubmit} className="form--border">
                <div className="u-margin-bottom">
                    <label htmlFor="email">Email address</label>
                    <input className="input--border" type="email" id="email" onChange={this.props.handleEmailChange} required />
                </div>
                <div className="text--center">
                    <input type="submit" className="o-btn o-btn--primary" value="Retrieve password" />
                </div>
            </form>
        );
    }

});

module.exports = ForgotPasswordForm;
import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import classNames from 'classnames';

const LoginForm = React.createClass({
    
    render:function() {
        
        var submitClasses = classNames({
            'o-btn o-btn--primary float--right':true,
            'o-btn--disabled':!this.props.isValid
        });

        if (this.props.errorMsg) {
            var errorMsg = <p className="text--center error-color">{this.props.errorMsg}</p>
        }
        
        return (
            <div className="o-layout__item u-1/2@tablet u-1/3@desktop">
                <main>
                    <h1 className="text--center">Login</h1>
                    <section className="c-accountForms c-accountForms__login u-clearfix">
                        <form onSubmit={this.props.onSubmit} className="form--border">
                            {errorMsg}
                            <div className="u-margin-bottom">
                                <label htmlFor="email">Email address</label>
                                <input className="input--border" type="email" id="email" onChange={this.props.handleEmailChange} required />
                            </div>
                            <div className="u-margin-bottom">
                                <label htmlFor="password">Password</label>
                                <input className="input--border" type="password" id="password" onChange={this.props.handlePasswordChange} required />
                            </div>
                            <Link className="float--left u-padding-top-small" to="/app/forgotpassword">Forgot password?</Link>
                            <input type="submit" className={submitClasses} value="Login" />
                        </form>
                    </section>
                    <div className="u-padding text--center">
                        <Link className="" to="/app/register">Don&apos;t have an account? Sign up for <strong className="nowrap">Vidfeed Plus.</strong></Link>
                    </div>
                </main>
            </div>
        );
    }

});

module.exports = LoginForm;
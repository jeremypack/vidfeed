import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

const RegisterForm = React.createClass({
    
    render:function() {
        return (
            <div className="o-layout__item u-1/3@tablet">
                <main>
                    <h1 className="text--center">Vidfeed Plus</h1>
                    <section className="c-accountForms c-accountForms__register u-clearfix">
                        <form onSubmit={this.props.onSubmit} className="form--border">
                            <div className="u-margin-bottom">
                                <label htmlFor="name">Name</label>
                                <input className="input--border" type="text" id="name" onChange={this.props.handleNameChange} required />
                            </div>
                            <div className="u-margin-bottom">
                                <label htmlFor="email">Email address</label>
                                <input className="input--border" type="email" id="email" onChange={this.props.handleEmailChange} required />
                            </div>
                            <div className="u-margin-bottom">
                                <label htmlFor="password">Password</label>
                                <input className="input--border" type="password" id="password" onChange={this.props.handlePasswordChange} required />
                            </div>
                            <div className="text--center">
                                <input type="submit" className="o-btn o-btn--primary" value="Register" />
                            </div>
                        </form>
                    </section>
                    <div className="u-padding text--center">
                        <Link className="" to="/app/login">Already have an account? <strong>Sign in</strong>.</Link>
                    </div>
                </main>
            </div>
        );
    }

});

module.exports = RegisterForm;
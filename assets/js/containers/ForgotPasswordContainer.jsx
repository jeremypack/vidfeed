import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

import ForgotPasswordForm from '../components/ForgotPasswordForm';

const ForgotPasswordContainer = React.createClass({
    
    getInitialState: function() {
        return {
            username:'',
            submitted:false
        };
    },

    _handleUsernameChange:function(e){
        this.setState({
            username: e.target.value
        });
    },

    _onSubmit:function(e){
        e.preventDefault();
        this.setState({
            submitted:true
        })
    },


    render: function() {
        
        if (!this.state.submitted) {
            var form = <ForgotPasswordForm 
                    handleUsernameChange={this._handleUsernameChange} 
                    onSubmit={this._onSubmit} />
        } else {
            var thanks = <div className="text--center">
                            <p>Thanks. A password reset link has been sent to your email address</p>
                            <Link className="o-btn o-btn--primary" to="/app/login">Back to <strong>Login</strong></Link>
                         </div>
        }
        

        return (
            <div className="o-layout o-layout--center u-margin-top-large">
                <div className="o-layout__item u-1/3">
                    <main>
                        <h1 className="text--center">Forgot Password</h1>
                        <section className="c-accountForms c-accountForms__forgotPassword u-clearfix">
                            {form}
                            {thanks}
                        </section>
                        <div className="u-padding text--center">
                            <Link className="" to="/app/register">Don&apos;t have an account? Sign up for <strong className="nowrap">Vidfeed Plus.</strong></Link>
                        </div>
                    </main>
                </div>
            </div>
        );
    }
});

module.exports = ForgotPasswordContainer;
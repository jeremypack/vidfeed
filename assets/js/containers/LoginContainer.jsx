import React from 'react';
import { browserHistory } from 'react-router';

import LoginForm from '../components/LoginForm';

const LoginContainer = React.createClass({
    
    getInitialState: function() {
        return {
            username:'',
            password:'',
            validationStarted:false,
            isValid:false,
            errorMsg:''
        };
    },

    componentWillUnmount: function() {
        clearInterval(this.validateInterval);
    },

    _handleUsernameChange:function(e){
        this.setState({
            username: e.target.value
        });
        var validateTrigger = function() {
            if(this.state.username) {
                this.setState({
                    isValid:true
                });
            } else {
                this.setState({
                    isValid:false
                });
            }
        }.bind(this);
        if (!this.state.validationStarted) {
            this.setState({
                validationStarted: true
            });
            this.validateInterval = setInterval(validateTrigger,500);
        }
    },

    _handlePasswordChange:function(e){
        this.setState({
            password: e.target.value
        });
    },

    _handleSubmit:function(e){
        e.preventDefault();
        if (!this.state.username || !this.state.password) {
            return;
        }
        $.ajax({
            type: 'POST',
            context: this,
            url: '/api/profile/login',
            data: {
                email: this.state.username,
                password: this.state.password
            },
            success: function (data){
                window.vidfeed.user.id = data.id;
                window.vidfeed.user.email = data.email;
                window.vidfeed.user.isAuthenticated = true;
                browserHistory.push('/app/dashboard');
            },
            error: function (data) {
                console.log(data,'error')
                console.log(data);
                if(data.responseJSON && data.responseJSON.non_field_errors) {
                    console.log(data.responseJSON.non_field_errors[0]);
                    this.setState({
                        errorMsg:data.responseJSON.non_field_errors[0]
                    })
                } else {
                    console.log("Unable to login at this time. Please contact support if this error persists.");
                    this.setState({
                        errorMsg:"Unable to login at this time. Please contact support if this error persists."
                    })
                }
            }
        });
    },

    render: function() {

        return (
            <div className="o-layout o-layout--center u-margin-top-large">
                <LoginForm
                    isValid={this.state.isValid}
                    handleEmailChange={this._handleUsernameChange} 
                    handlePasswordChange={this._handlePasswordChange}
                    onSubmit={this._handleSubmit}
                    errorMsg={this.state.errorMsg} />
            </div>
        );
    }
});

module.exports = LoginContainer;
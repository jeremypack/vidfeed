import React from 'react';

import LoginForm from '../components/LoginForm';

const LoginContainer = React.createClass({
    
    getInitialState: function() {
        return {
            username:'',
            password:''
        };
    },

    _handleUsernameChange:function(e){
        this.setState({
            username: e.target.value
        });
    },

    _handlePasswordChange:function(e){
        this.setState({
            password: e.target.value
        });
    },

    _handleSubmit:function(e){
        e.preventDefault();
        $.ajax({
            type: 'POST',
            context: this,
            url: '/api/auth/login/',
            data: {
                email: this.state.username,
                password: this.state.username
            },
            success: function (data){
                console.log(data,'success')
            },
            error: function (data) {
                console.log(data,'error')
            }
        });
    },

    render: function() {
        return (
            <div className="o-layout o-layout--center u-margin-top-large">
                <LoginForm
                    hanldeEmailChange={this._handleUsernameChange} 
                    handlePasswordChange={this._handlePasswordChange}
                    onSubmit={this._handleSubmit} />
            </div>
        );
    }
});

module.exports = LoginContainer;
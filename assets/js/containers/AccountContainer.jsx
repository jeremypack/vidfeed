import React from 'react';

import AccountForm from '../components/AccountForm';

const AccountContainer = React.createClass({
    
    getInitialState: function() {
        return {
            name:'',
            nameArray:'',
            username:'',
            password:''
        };
    },

    _handleNameChange:function(e){
        this.setState({
            name: e.target.value,
            nameArray: this.state.name.split(' ')
        });

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

    _handleSubmit: function(e) {
        e.preventDefault();
        var firstName = this.state.nameArray[0];
        var lastName = this.state.nameArray[this.state.nameArray.length - 1];
        $.ajax({
            method: 'POST',
            url: '/api/profile/account',
            context: this,
            data: {
                'first_name': firstName,
                'last_name': lastName,
                'email': this.state.username,
                'password': this.state.password,
                'subscription_type': 1 // 1 == Monthly, 2 == Yearly
            },
            success: function (data) {
                console.log(data,'success');
            }.bind(this),
            error: function (data) {
                console.log(data,'error');
            }.bind(this)
        });
    },

    render: function() {
        return (
            <div className="o-layout o-layout--center o-layout--middle u-margin-top-large">
                <AccountForm 
                    handleNameChange={this._handleNameChange} 
                    handleEmailChange={this._handleUsernameChange}
                    handlePasswordChange={this._handlePasswordChange}
                    onSubmit={this._handleSubmit} />
            </div> 
        );
    }
});

module.exports = AccountContainer;
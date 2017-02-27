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

    },

    _handlePasswordChange:function(e){

    },


    render: function() {
        return (
            <div className="o-layout o-layout--center u-margin-top-large">
                <LoginForm />
            </div>
        );
    }
});

module.exports = LoginContainer;
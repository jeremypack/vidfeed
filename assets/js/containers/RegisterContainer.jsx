import React from 'react';
import { browserHistory } from 'react-router';

import RegisterForm from '../components/RegisterForm';

const RegisterContainer = React.createClass({
    
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
            url: '/api/profile/register',
            context: this,
            data: {
                'first_name': firstName,
                'last_name': lastName,
                'email': this.state.username,
                'password': this.state.password,
                'subscription_type': 1 // 1 == Monthly, 2 == Yearly
            },
            success: function (data) {
                this._loginAfterRegister();
            }.bind(this),
            error: function (data) {
                console.log(data,'error');
            }.bind(this)
        });
    },

    _loginAfterRegister:function(){
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
                browserHistory.push('/app/dashboard/');
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
            <div className="o-layout o-layout--center o-layout--middle u-margin-top-large">
                <RegisterForm 
                    handleNameChange={this._handleNameChange} 
                    handleEmailChange={this._handleUsernameChange}
                    handlePasswordChange={this._handlePasswordChange}
                    onSubmit={this._handleSubmit} />
                <div className="o-layout__item u-2/3@tablet">
                    <h1 className="text--center font--light">Get more out of Vidfeed…</h1>
                    <div className="c-getPlus__features o-layout--large text--left u-padding-left-large u-margin-top-large">
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item u-margin-bottom-large">
                                <i className="c-getPlus__icon icon icon--dashboard"></i>
                                <h3>Dashboard View</h3>
                                <p>Keep all your videos and projects organised and easy to find with our dashboard view.</p>
                            </div>
                        </div>
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item u-margin-bottom-large">
                                <i className="c-getPlus__icon icon icon--todo"></i>
                                <h3>ToDo List</h3>
                                <p>Turn your comments into actionable items and keep everyone updated on progress.</p>
                            </div>
                        </div>
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item u-margin-bottom-large">
                                <i className="c-getPlus__icon icon icon--vimeo"></i>
                                <h3>Vimeo & YouTube Integration</h3>
                                <p>View all your YouTube/Vimeo videos from within Vidfeed and upload new ones if needed.</p>
                            </div>
                        </div>
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item u-margin-bottom-large">
                                <i className="c-getPlus__icon icon icon--unlimited"></i>
                                <h3>Unlimited</h3>
                                <p>Get unlimited feeds, projects and collaborators for an infinite amount of time.</p>
                            </div>
                        </div>
                        <div className="o-layout__item">
                            <div className="text--center">
                                <h2 className="">Sign up for only <span className="h1 error-color">£5</span> per month or <span className="h1 error-color">£50</span> annually.</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
});

module.exports = RegisterContainer;
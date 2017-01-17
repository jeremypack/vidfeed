import React from 'react';

import classNames from 'classnames';

import GetPlusIntro from '../components/GetPlusIntro';
import GetPlusForm from '../components/GetPlusForm';
import GetPlusThanks from '../components/GetPlusThanks';

const GetPlusContainer = React.createClass({

    propTypes: {
        show:           React.PropTypes.bool.isRequired,
        hide:           React.PropTypes.func.isRequired,

    },

    getInitialState:function(){
        return {
            signUpStage:0,
            planSelect:2,
            name:'',
            email:'',
            password:''
        };
    },

    componentDidMount: function() {
        if (window.vidfeed.user.email) {
            this.setState({
                email:window.vidfeed.user.email
            });
        }
    },

    componentWillUnmount:function() {
        this.setState({
            signUpStage:0,
            planSelect:2
        });
    },

    _yearPlanSelect:function(e) {
        e.preventDefault();
        this.setState({
            planSelect:2
        });
    },

    _monthPlanSelect:function(e) {
        e.preventDefault();
        this.setState({
            planSelect:1
        });
    },

    _handleNameChange:function(e){
        this.setState({
            name: e.target.value
        });
    },

    _handleEmailChange:function(e){
        this.setState({
            email: e.target.value
        });
    },

    _handlePasswordChange:function(e){
        this.setState({
            password: e.target.value
        });
    },

    _handleSubmit: function(e) {
        e.preventDefault();
        var nameArray = this.state.name.split(' ');
        var firstName = nameArray[0];
        var lastName = nameArray[nameArray.length - 1];
        $.ajax({
            method: 'POST',
            url: '/api/profile/register',
            context: this,
            data: {
                'first_name': firstName,
                'last_name': lastName,
                'email': this.state.email,
                'password': this.state.password,
                'subscription_type': this.state.planSelect // 1 == Monthly, 2 == Yearly
            },
            success: function (data) {
                this._nextStage();
                if (window.vidfeed.user.email != this.state.email) {
                    window.vidfeed.user.email = this.state.email
                }
            }.bind(this),
            error: function (data) {
                console.log(data,'error');
            }.bind(this)
        });
    },

    _nextStage: function() {
        this.setState({
            signUpStage: this.state.signUpStage + 1
        });  
    },

    render:function(){
        if (this.state.signUpStage === 0) {
            var intro = <GetPlusIntro next={this._nextStage} />
        }

        if (this.state.signUpStage === 1) {
            var form = <GetPlusForm
                            yearPlanSelected={this.state.planSelect === 2 ? true : false}
                            monthPlanSelected={this.state.planSelect === 1 ? true : false}
                            yearPlanSelect={this._yearPlanSelect}
                            monthPlanSelect={this._monthPlanSelect}
                            emailValue={this.state.email}
                            handleNameChange={this._handleNameChange}
                            handleEmailChange={this._handleEmailChange}
                            handlePasswordChange={this._handlePasswordChange}
                            onSubmit={this._handleSubmit} />
        }

        if (this.state.signUpStage === 2) {
            var thanks = <GetPlusThanks />
        }

        var drawerClasses = classNames({
            'o-offCanvas__drawer':true,
            'o-offCanvas__drawer--open':this.props.show
        });

        return (
            <div className={drawerClasses}>
                <div className="c-getPlus o-offCanvas__drawer__inner u-3/4 u-2/3@tablet u-1/2@desktop">
                    <div className="box__header">
                        <h3 className="box__title">Get Vidfeed plus</h3>
                        <a href="#" onClick={this.props.hide} className="box__close">×<span className="u-hidden-visually">Close</span></a>
                    </div>
                    {intro}
                    {form}
                    {thanks}
                </div>
            </div>
            
        );
    }

});

module.exports = GetPlusContainer;
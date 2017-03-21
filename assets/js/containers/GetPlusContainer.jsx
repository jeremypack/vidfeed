import React from 'react';

import classNames from 'classnames';

import GetPlusIntro from '../components/GetPlusIntro';
import GetPlusForm from '../components/GetPlusForm';
import GetPlusThanks from '../components/GetPlusThanks';

const GetPlusContainer = React.createClass({

    propTypes: {
        show:           React.PropTypes.bool.isRequired,
        hide:           React.PropTypes.func.isRequired,
        pageHeight:     React.PropTypes.number
    },

    getInitialState:function(){
        return {
            signUpStage:0,
            planSelect:2,
            name:'',
            email:'',
            password:'',
            position:'absolute'
        };
    },

    componentDidMount: function() {
        if (window.vidfeed.user.email) {
            this.setState({
                email:window.vidfeed.user.email
            });
        }
        this._resizeContent();
        window.addEventListener('resize', this._resizeContent);
    },

    componentWillUnmount:function() {
        this.setState({
            signUpStage:0,
            planSelect:2
        });
        window.removeEventListener('resize', this._resizeContent);
    },

    _resizeContent:function() {
        this.setState({
            position:'resizing'
        }, function(){
            setTimeout(function(){
                if (this.refs.getPlusDiv.clientHeight > window.innerHeight) {
                    this.setState({
                        position:'absolute'
                    });
                } else {
                    this.setState({
                        position:'fixed'
                    });
                }
            }.bind(this), 200);
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

        if (this.state.position === 'absolute') {
             var getPlusStyle = {
                position:'absolute',
                height:this.props.pageHeight
            }
        }
        if (this.state.position === 'fixed') {
            var getPlusStyle = {
                position:'fixed',
                height:'100%'
            }
        }
        if (this.state.position === 'resizing') {
            var getPlusStyle = {
                position:'absolute',
                height:'auto'
            }
        }

        return (
            <div className={drawerClasses}>
                <div className="c-getPlus o-offCanvas__drawer__inner u-1/1 u-3/4@tablet" style={getPlusStyle} ref="getPlusDiv">
                    <a href="#" onClick={this.props.hide} className="c-getPlus__close">×<span className="u-hidden-visually">Close</span></a>
                    {intro}
                    {form}
                    {thanks}
                </div>
            </div>
            
        );
    }

});

module.exports = GetPlusContainer;
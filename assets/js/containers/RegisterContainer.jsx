import React from 'react';

import RegisterForm from '../components/RegisterForm';

const RegisterContainer = React.createClass({
    
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
            <div className="o-layout o-layout--center o-layout--middle u-margin-top-large">
                <RegisterForm />
                <div className="o-layout__item u-2/3@tablet">
                    <h2 className="text--center font--light">Get more out of Vidfeed…</h2>
                    <div className="c-getPlus__features o-layout--large text--left u-padding-left-large">
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
                    </div>
                </div>
            </div> 
        );
    }
});

module.exports = RegisterContainer;
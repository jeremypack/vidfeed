import React from 'react';
import classNames from 'classnames';

import User from '../components/User';

const ShareFeed = React.createClass({
    
    propTypes: {
        heading:            React.PropTypes.string.isRequired,
        collectedEmails:    React.PropTypes.array.isRequired,
        handleChange:       React.PropTypes.func.isRequired,
        addEmail:           React.PropTypes.func.isRequired,
        currentEmail:       React.PropTypes.string.isRequired,
        onRemove:           React.PropTypes.func.isRequired,
        handleSubmit:       React.PropTypes.func.isRequired,
        submittedMsg:       React.PropTypes.string.isRequired,
        submitted:          React.PropTypes.bool.isRequired
    },

    componentDidMount:function() {
        setTimeout(function(){
            this.refs.emailInput.focus();
        }.bind(this),200);
        
    },

    _remove: function(item) {
        return function(e) {
            e.preventDefault();
            return this.props.onRemove(item);
        }.bind(this);
    },

    render: function(){
        
        if (this.props.collectedEmails.length) {
            
            var emailsArr = this.props.collectedEmails;
            var emailNodes = emailsArr.map(function(email, i){
                return (
                    <li className="invitees__item" key={i}><User userEmail={email} id={i} removeUser={true} removeFunc={this._remove} /></li>
                );
            }.bind(this));
            var invitees =  <div className="invitees">
                                <div className="u-padding-small u-padding-bottom-none">
                                    <p className="u-margin-none">Collaborators</p>
                                </div>
                                <ul className="invitees__list o-list-bare">
                                    {emailNodes}
                                </ul>  
                            </div>
        }

        var addEmailBtnClasses = classNames({
            'o-btn o-btn--secondary o-btn--small':true,
            'o-btn--disabled':!this.props.isValid
        });

        var inviteBtnClasses = classNames({
            'o-btn o-btn--primary':true,
            'o-btn--disabled':!this.props.collectedEmails.length
        });

        var currentUrl = window.location.href;

        if (this.props.submitted) {
            return (
                <div className="modal__submitted">
                    <h3 className="box__title">{this.props.submittedMsg}</h3>
                </div>
            );
        }
        
        return (

            <div className="modal__content">
                <div className="box__header">
                    <h3 className="box__title">{this.props.heading}</h3>
                    <a href="#" onClick={this.props.closeModal} className="modal__close">×<span className="u-hidden-visually">Close</span></a>
                </div>
                <div className="modal__body">
                    <form className="form--border" onSubmit={this.props.addEmail}>
                        <div className="u-padding-small u-padding-top">
                            <div className="input-with-button">
                                <input ref="emailInput"  placeholder="Email address" type="email" onChange={this.props.handleChange} value={this.props.currentEmail} className="input--border" />
                                <input type="submit" value="Add" className={addEmailBtnClasses} />
                            </div>
                        </div>
                        {invitees}
                        <div className="text--center u-padding">
                            <a href="#" onClick={this.props.handleSubmit} className={inviteBtnClasses}>Invite people</a>
                        </div>
                    </form>
                </div>
                <div className="modal__footer">
                    <p><span>Shareable link:</span> {currentUrl}</p>
                </div>
            </div>
        );
    }
});

module.exports = ShareFeed;
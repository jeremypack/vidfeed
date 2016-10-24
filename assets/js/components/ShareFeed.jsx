var React = require('react');
var classNames = require('classnames');

var User = require('../components/User');

var ShareFeed = React.createClass({
    
    propTypes: {
        collectedEmails:    React.PropTypes.array.isRequired,
        handleChange:       React.PropTypes.func.isRequired,
        addEmail:           React.PropTypes.func.isRequired,
        currentEmail:       React.PropTypes.string.isRequired,
        onRemove:           React.PropTypes.func.isRequired,
        handleSubmit:       React.PropTypes.func.isRequired
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
                    <li className="invitees__item" key={i}><User userEmail={email} removeUser={true} removeFunc={this._remove} /></li>
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
        return (
            <div className="modal__content">
                <div className="modal__header">
                    <h3 className="modal__title">Share this video</h3>
                    <a href="#" onClick={this.props.closeModal} className="modal__close">×<span className="u-hidden-visually">Close</span></a>
                </div>
                <form className="form--border" onSubmit={this.props.handleSubmit}>
                    <div className="u-padding-small u-padding-top">
                        <div className="input-with-button">
                            <input placeholder="Email address" type="email" onChange={this.props.handleChange} value={this.props.currentEmail} className="input--border" />
                            <a href="#" onClick={this.props.addEmail} className={addEmailBtnClasses}>Add</a>
                        </div>
                    </div>
                    {invitees}
                    <div className="text--center u-padding">
                        <input type="submit" value="Invite people" className={inviteBtnClasses} />
                    </div>
                </form>
                <div className="modal__footer">
                    <p><span>Shareable link:</span> {currentUrl}</p>
                </div>
            </div>
        );
    }
});

module.exports = ShareFeed;
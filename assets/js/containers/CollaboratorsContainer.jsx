import React from 'react';
import Modal from 'react-modal';

import User from '../components/User';
import ModalInner from '../components/ModalInner';

const modalStyles = {
    overlay : {
        backgroundColor       : 'transparant'
    },
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        minWidth              : '300px',
        marginRight           : '-50%',
        padding               : '0',
        border                : '0',
        backgroundColor       : 'transparant',
        borderRadius          : '0',
        transform             : 'translate(-50%, -50%)',
        transition            : 'opacity .4s ease-in-out',
        opacity               : '0',
        boxShadow             : '0px 0px 4px -1px rgba(0,0,0,.25)'
    }
};

const CollaboratorsContainer = React.createClass({
    
    propTypes: {
        feedId:            React.PropTypes.string.isRequired,
        modalOpen:         React.PropTypes.func.isRequired,
        modalClose:        React.PropTypes.func.isRequired,
        pollInterval:      React.PropTypes.number.isRequired
    },

    getInitialState: function() {
        return {
            data: [],
            modalIsOpen: false
        };
    },

    componentDidMount: function() {
        this._loadCollaboratorsFromServer();
        this.collaboratorsInterval = setInterval(this._loadCollaboratorsFromServer, this.props.pollInterval);
    },

    componentWillUnmount:function(){
        clearInterval(this.collaboratorsInterval);
    },
    
    _loadCollaboratorsFromServer: function() {
        $.ajax({
            url: '/api/feeds/' + this.props.feedId + '/collaborators',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    data: data
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.feedId, status, err.toString());
            }.bind(this)
        });
        
    },

    _openModal : function (e) {
        e.preventDefault();
        this.setState({
            modalIsOpen: true
        });
        this.props.modalOpen();
    },

    _closeModal : function (e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            modalIsOpen: false
        });
        this.props.modalClose();
    },

    render: function() {
        
        if (!this.state.data) {
            return;
        } else {
            var collaboratorNodes = this.state.data.map(function(collaborator, i) {
                return (
                    <li className="invitees__item" key={i}><User id={collaborator.user.id} userEmail={collaborator.user.email} /></li>
                );
            }.bind(this));

            var collaboratorsModal = <div>
                                        <Modal
                                            isOpen={this.state.modalIsOpen}
                                            onRequestClose={this._closeModal}
                                            style={modalStyles}>
                                            <ModalInner
                                                heading="Collaborators"
                                                closeModal={this._closeModal}>
                                                <div className="u-padding-small u-padding-top">
                                                    <p className="u-margin-bottom-none">Feed shared with…</p>
                                                </div>
                                                <ul className="invitees__list o-list-bare">
                                                    {collaboratorNodes}
                                                </ul>
                                            </ModalInner>
                                        </Modal>
                                    </div>;

            var avatarNodes = this.state.data.map(function(collaborator,i) {
                return (
                    <User
                        id={collaborator.user.id}
                        userEmail={collaborator.user.email}
                        iconOnly={true}
                        key={i} />
                );
            }.bind(this));

            var avatarLimited = [];
            for (var i=0; i<4; i++) {
                avatarLimited.push(avatarNodes[i]);
            }
            
            if (this.state.data.length > 4) {
                return (
                    <div className="c-collaborators">
                        {avatarLimited}
                        <a href="#" className="ellipsis" onClick={this._openModal}>…</a>
                        {collaboratorsModal}
                    </div>
                );
            }

            return (
                <div className="c-collaborators">
                    {avatarNodes}            
                </div>
            );
        }
    }

});

module.exports = CollaboratorsContainer;
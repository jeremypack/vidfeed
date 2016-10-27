var React = require('react');
var Modal = require('react-modal');

var EmailForm = require('../components/EmailForm');
var ModalChoice = require('../components/ModalChoice');

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
        borderRadius          : '0',
        transform             : 'translate(-50%, -50%)',
        transition            : 'opacity .4s ease-in-out',
        opacity               : '0',
        boxShadow             : '1px 1px 4px -1px rgba(0,0,0,.25)'
    }
};

var OwnFeedContainer = React.createClass({
    
    getInitialState : function () {
        return {
            modalIsOpen: false,
            owner:'',
            submitted: false,
            sessionUser:window.vidfeed.user.email,
            newOwner:false,
            feedId: this.props.feedId,
            validationStarted:false,
            isValid:false,
        };
    },

    componentDidMount: function() {
        this._openModal();
        if (!this.state.sessionUser) {
            this._setNewOwner();
        }
    },

    componentWillUnmount: function() {
        clearInterval(this.validateInterval);
    },

    _openModal : function () {
        setTimeout(function() {
            this.setState({ modalIsOpen: true });
            this.props.modalOpen();
        }.bind(this), this.props.wait);
    },

    _closeModal : function (e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            modalIsOpen: false
        });
        this.props.modalClose();

        if (!this.state.submitted) {
            this._openModal();
        }
    },

    _useSessionUser:function(e) {
        e.preventDefault();
        this.setState({
            owner: window.vidfeed.user.email
        },this._handleSubmit);
    },

    _setNewOwner:function(e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            newOwner: true
        });
    },

    _handleOwnerChange: function(e) {
        this.setState({
            owner: e.target.value
        });
        var validateTrigger = function() {
            this._validate();
        }.bind(this);
        if (!this.state.validationStarted) {
            this.setState({
                validationStarted: true
            });
            this.validateInterval = setInterval(validateTrigger,1000);
        }
    },

    _handleSubmit: function(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.state.validationStarted && !this.state.isValid) {
            return;
        }
        $.ajax({
            type: "POST",
            context: this,
            url: "/api/feeds/" + this.state.feedId + '/set-owner/',
            data: {
                owner: this.state.owner
            },
            success: function (ev){
                this.setState({
                    submitted:true
                });
                setTimeout(function() {
                    this._closeModal();
                }.bind(this), 2000);
                window.vidfeed.user.email = this.state.owner;
            },
            error: function (ev) {
                console.log(this.state.owner,'this.state.owner');
                console.log(this.state.feedId,'this.state.feedId');
            }
        });
    },

    _validate:function(){
        var checkEmail = function(email) {
            var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(email);
        }
        if (checkEmail(this.state.owner)) {
            this.setState({
                isValid:true
            });
        } else {
            this.setState({
                isValid:false
            });
        }
    },

    render : function() {

        if (this.state.sessionUser && !this.state.newOwner) {
            var sessionUserCheck =  <ModalChoice
                                        closeModal={this._closeModal}
                                        yesAction={this._useSessionUser}
                                        noAction={this._setNewOwner}
                                        heading='Own this Feed'
                                        text='Is this your email?'
                                        confirmOwner={this.state.sessionUser}
                                        submitted={this.state.submitted} 
                                        submittedMsg='Feed owned!' />
        }

        if (this.state.newOwner) {
            
            if (this.state.validationStarted && !this.state.isValid) {
                var valid = false;
            }
            if (this.state.validationStarted && this.state.isValid) {
                var valid = true;
            }

            var setNewOwner = <EmailForm
                                heading='Own this Feed'
                                closeModal={this._closeModal}
                                handleSubmit={this._handleSubmit}
                                isValid={valid}
                                value={this.state.owner}
                                handleChange={this._handleOwnerChange}
                                submitted={this.state.submitted} 
                                submittedMsg='Feed owned!' />
        }   

        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this._closeModal}
                    style={modalStyles}>
                    {sessionUserCheck}
                    {setNewOwner}
                </Modal>
            </div>
        );
        
    }
});

module.exports = OwnFeedContainer;
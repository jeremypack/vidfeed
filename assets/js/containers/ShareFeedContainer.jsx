var React = require('react');
var Modal = require('react-modal');

var SetSessionUserContainer = require('../containers/SetSessionUserContainer');

var ShareFeed = require('../components/ShareFeed');

const modalStyles = {
    overlay : {
        backgroundColor       : 'transparant'
    },
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
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

var ShareFeedContainer = React.createClass({
    
    propTypes: {
        feedId:             React.PropTypes.string.isRequired,
        modalOpen:          React.PropTypes.bool.isRequired,
        modalClose:         React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            modalIsOpen: false,
            currentEmail:'',
            addedEmails:[],
            validationStarted:false,
            isValid:false,
            setSession:false,
            submitted:false
        };
    },

    componentDidMount: function() {
        this.setState({
            modalIsOpen: this.props.modalOpen
        });
    },

    componentWillUnmount: function() {
        clearInterval(this.validateInterval);
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

    _handleChange: function(e) {
        this.setState({
            currentEmail:e.target.value
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

    _addEmail: function(e) {
        e.preventDefault();
        if (this.state.validationStarted && !this.state.isValid) {
            return;
        }
        var currentEmail = this.state.currentEmail;
        var emails = this.state.addedEmails;
        var newEmails = emails.concat([currentEmail]);
        this.setState({ 
            addedEmails: newEmails,
            currentEmail:''
        });
    },

    _deleteItem: function(item) {
        var items = this.state.addedEmails.filter(function(itm){
            return item !== itm;
        });
        this.setState({
            addedEmails: items
        });
    },

    _handleSubmit: function(e) {
        if (e) {
            e.preventDefault();
        }
        if (!window.vidfeed.user.email) {
            this.setState({
                setSession: true
            });
            return;
        }
        $.ajax({
            url: '/api/feeds/' + this.props.feedId + '/invites',
            dataType: 'json',
            type: 'POST',
            context: this,
            data: JSON.stringify({
                'sender': window.vidfeed.user.email,
                'invites': this.state.addedEmails
            }),
            success: function (data) {
                console.log("successfully invested the users");
                console.log(data);
                this.setState({
                    currentEmail: '',
                    addedEmails: [],
                    submitted:true
                });
                setTimeout(function() {
                    this._closeModal();
                }.bind(this), 2000);
            },
            error: function (data) {
                console.log(window.vidfeed.user.email,'window.vidfeed.user.email');
                console.log("failed to invite users");
                console.log(data);
            }
        });
    },

    _validate:function(){
        var checkEmail = function(email) {
            var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(email);
        }
        if (checkEmail(this.state.currentEmail)) {
            this.setState({
                isValid:true
            });
        } else {
            this.setState({
                isValid:false
            });
        }
    },

    render: function() {
        var emailList = this.state.addedEmails;

        if (this.state.validationStarted && !this.state.isValid) {
            var valid = false;
        }
        if (this.state.validationStarted && this.state.isValid) {
            var valid = true;
        }

        if (this.state.setSession) {
            return (
                <div>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this._closeModal}
                        style={modalStyles}>
                        <SetSessionUserContainer
                            modalHeading='Who are you?'
                            extraText='Let your contacts know who is sharing this feed.'
                            submittedMsg='Feed has been shared!'
                            onSubmit={this._handleSubmit} />
                    </Modal>
                </div>
            );
        }

        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this._closeModal}
                    style={modalStyles}>
                    <ShareFeed
                        heading='Share this feed'
                        isValid={valid}
                        closeModal={this._closeModal}
                        handleChange={this._handleChange}
                        addEmail={this._addEmail}
                        currentEmail={this.state.currentEmail}
                        collectedEmails={emailList}
                        onRemove={this._deleteItem}
                        handleSubmit={this._handleSubmit}
                        submittedMsg='Feed has been shared!'
                        submitted={this.state.submitted} />
                </Modal>
            </div>
        );
    }

});

module.exports = ShareFeedContainer;
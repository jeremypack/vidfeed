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
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        transition            : 'opacity .4s ease-in-out',
        opacity               : '0'
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
            feedId: this.props.feedId 
        };
    },

    componentDidMount: function() {
        this._openModal();
    },

    _useSessionUser:function(e) {
        e.preventDefault();
        this.setState({
            owner: window.vidfeed.user.email
        },this._handleSubmit);
    },

    _setNewOwner:function(e) {
        e.preventDefault();
        this.setState({
            newOwner: true
        });
    },

    _handleOwnerChange: function(e) {
        this.setState({
            owner: e.target.value
        });
    },

    _handleSubmit: function(e) {
        if (e) {
            e.preventDefault();
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
            var setNewOwner = <EmailForm
                                heading='Own this Feed'
                                closeModal={this._closeModal}
                                handleSubmit={this._handleSubmit}
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
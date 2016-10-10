var React = require('react');
var Modal = require('react-modal');

var EmailForm = require('../components/EmailForm');

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
            owner:undefined,
            submitted: false,
            feedId: this.props.feedId 
        };
    },

    componentWillMount: function() {
        var that = this;
        setTimeout(function() {
            that._openModal();
        }, that.props.wait);
    },

    _handleOwnerChange: function(e) {
        this.setState({owner: e.target.value});
    },

    _handleSubmit: function(e) {
        e.preventDefault();
        window.vidfeed.user.email = this.state.author;
        $.ajax({
            type: "POST",
            context: this,
            url: "/api/feeds/" + this.state.feedId + '/set-owner/',
            data: {
                owner: this.state.owner,
            },
            success: function (ev){
                this.setState({
                    hidden:'u-hidden',
                    submitted:true
                });
                setTimeout(function() {
                    this._closeModal();
                }.bind(this), 2000);
            },
            error: function (ev) {
                console.log(this.state.owner,'this.state.owner');
                console.log(this.state.feedId,'this.state.feedId');
            }
        });
    },

    _openModal : function () {
        this.setState({ owner: this.props.feedOwner });
        if (!this.state.owner) {
            this.setState({ modalIsOpen: true });
            this.props.modalOpen();
        }
        
    },

    _closeModal : function (e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({modalIsOpen: false});
        this.props.modalClose();
    },

    render : function() {
        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this._closeModal}
                    style={modalStyles} >
                    <EmailForm
                        heading='Own this Feed'
                        closeModal={this._closeModal}
                        handleSubmit={this._handleSubmit}
                        value={this.state.owner}
                        handleChange={this._handleOwnerChange}
                        submitted={this.state.submitted} 
                        submittedMsg='Feed owned!' />
                </Modal>
            </div>
        );
        
    }
});

module.exports = OwnFeedContainer;
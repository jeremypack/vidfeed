var React = require('react');
var Modal = require('react-modal');

var ShareFeed = require('../components/ShareFeed');

const customStyles = {
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
    opacity               :'0'
  }
};

var ShareFeedContainer = React.createClass({
    
    getInitialState: function() {
        return {
            modalIsOpen: this.props.modalOpen,
            currentEmail:'',
            addedEmails:[]
        };
    },

    _openModal : function (e) {
        e.preventDefault();
        this.setState({modalIsOpen: true});
    },

    _closeModal : function (e) {
        e.preventDefault();
        this.setState({modalIsOpen: false});
        this.props.modalClose();
    },

    _handleChange: function(e) {
        this.setState({currentEmail:e.target.value});
    },

    _addEmail: function(e) {
        e.preventDefault();
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
        e.preventDefault();
        console.log(this.state.addedEmails,'emails to be submitted');
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
            this.setState({currentEmail: '', addedEmails: []});
          },
          error: function (data) {
            console.log("failed to invite users");
            console.log(data);
          }
        });
    },

    render: function() {
        var emailList = this.state.addedEmails;
        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this._closeModal}
                    style={customStyles} >
                        <ShareFeed
                            closeModal={this._closeModal}
                            handleChange={this._handleChange}
                            addEmail={this._addEmail}
                            currentEmail={this.state.currentEmail}
                            collectedEmails={emailList}
                            onRemove={this._deleteItem}
                            handleSubmit={this._handleSubmit} />
                </Modal>
            </div>
        );
    }

});

module.exports = ShareFeedContainer;
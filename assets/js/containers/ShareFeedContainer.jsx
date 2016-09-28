var React = require('react');

var ShareFeed = require('../components/ShareFeed');

var ShareFeedContainer = React.createClass({
    
    getInitialState: function() {
        return {
            currentEmail:'',
            addedEmails:[]
        };
    },

    _handleChange: function(e) {
        this.setState({currentEmail:e.target.value});
    },

    _addEmail: function(e) {
        e.preventDefault();
        var currentEmail = this.state.currentEmail;
        var emails = this.state.addedEmails;
        var newEmails = emails.concat([currentEmail]);
        console.log(newEmails,'newEmails');
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
        this.setState({currentEmail: '', addedEmails: []});
    },

    render: function() {
        var emailList = this.state.addedEmails;
        return (
            <ShareFeed
                handleChange={this._handleChange}
                addEmail={this._addEmail}
                currentEmail={this.state.currentEmail}
                collectedEmails={emailList}
                onRemove={this._deleteItem}
                handleSubmit={this._handleSubmit} />
        );
    }

});

module.exports = ShareFeedContainer;
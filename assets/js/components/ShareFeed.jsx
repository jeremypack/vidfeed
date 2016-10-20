var React = require('react');

var InviteesList = require('../components/InviteesList');

var ShareFeed = React.createClass({
    render: function(){
        if (this.props.collectedEmails.length) {
            var invitees = <InviteesList list={this.props.collectedEmails} onRemove={this.props.onRemove} />
        }
        return (
            <div>
                <a href="#" onClick={this.props.closeModal}>Close</a>
                <h3>Share this video</h3>
                <form className="shareFeedForm" onSubmit={this.props.handleSubmit}>
                    <input type="email" onChange={this.props.handleChange} value={this.props.currentEmail} />
                    <a href="#" onClick={this.props.addEmail}>Add email</a>
                    {invitees}
                    <input type="submit" value="Invite" />
                </form>
            </div>
        );
    }
});

module.exports = ShareFeed;
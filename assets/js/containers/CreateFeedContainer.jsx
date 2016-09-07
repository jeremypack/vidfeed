var React = require('react');
import { browserHistory } from 'react-router'

var CreateFeed = require('../components/CreateFeed');

var CreateFeedContainer =  React.createClass({
    
    getInitialState: function () {
        return {videoUrl:'', feedDetails: '', error: ''};
    },

    handleUrlChange: function (e) {
        this.setState({videoUrl: e.target.value});
    },

    handleSubmit: function (e) {
        e.preventDefault();
        var videoUrl = this.state.videoUrl.trim();
        if (!videoUrl) {
            return;
        }
        $.ajax({
            type: "POST",
            context: this,
            url: "/api/feeds/",
            data: {
                videoUrl: videoUrl
            },
            success: function (ev){
                const path = '/app/feed/' + ev.feed_id;
                browserHistory.push(path);
            },
            error: function (ev) {
                this.setState({error: JSON.parse(ev.responseText).message, feedDetails: ''});
            }
        });
    },

    render: function() {
        return (
            <div>
                <CreateFeed 
                    submitHandler={this.handleSubmit}
                    value={this.state.videoUrl}
                    changeHandler={this.handleUrlChange}
                    details={this.state.feedDetails}
                    error={this.state.error} />
            </div>
        );
    }

});

module.exports = CreateFeedContainer;
var React = require('react');
import { browserHistory } from 'react-router';

var CreateFeed = require('../components/CreateFeed');

var CreateFeedContainer =  React.createClass({
    
    getInitialState: function () {
        return {
            videoUrl:'',
            validationStarted:false,
            isValid:false,
            error: ''
        };
    },

    componentWillUnmount: function() {
        clearInterval(this.validateInterval);
    },

    _handleUrlChange: function (e) {
        this.setState({
            videoUrl: e.target.value
        });
        var validateTrigger = function() {
            this._validate();
        }.bind(this);
        if (!this.state.validationStarted) {
            this.setState({
                validationStarted: true
            });
            this.validateInterval = setInterval(validateTrigger,500);
        }
    },

    _handleSubmit: function (e) {
        e.preventDefault();
        var videoUrl = this.state.videoUrl.trim();
        if (!videoUrl || !this.state.isValid) {
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
                this.setState({
                    error: JSON.parse(ev.responseText).message
                });
            }
        });
    },

    _validate:function(){
        if (this.state.videoUrl.indexOf('vimeo') !== -1 || this.state.videoUrl.indexOf('youtube') !== -1 || this.state.videoUrl.indexOf('youtu.be') !== -1) {
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

        if (this.state.validationStarted && !this.state.isValid) {
            var valid = false;
        }
        if (this.state.validationStarted && this.state.isValid) {
            var valid = true;
        }

        return (
            <CreateFeed 
                isValid={valid}
                submitHandler={this._handleSubmit}
                value={this.state.videoUrl}
                changeHandler={this._handleUrlChange}
                error={this.state.error} />
        );
    }

});

module.exports = CreateFeedContainer;
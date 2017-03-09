import React from 'react';
import { browserHistory } from 'react-router';

import CreateFeed from '../components/CreateFeed';

const CreateFeedContainer =  React.createClass({
    
    propTypes: {
        projectId:          React.PropTypes.number
    },

    getInitialState: function () {
        return {
            videoUrl:'',
            validationStarted:false,
            isValid:false,
            error: '',
            showInvalidMsg:false,
            isDashboard:false
        };
    },

    componentDidMount:function(){
        if (this.props.projectId || this.props.projectId === 0) {
            this.setState({
                isDashboard:true
            })
        }
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
            this.validateInterval = setInterval(validateTrigger,250);
        }

    },

    _handleSubmit: function (e) {
        e.preventDefault();
        var videoUrl = this.state.videoUrl.trim();
        if (!this.state.isValid) {
            this.setState({
                showInvalidMsg:true
            });
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
                // if (this.state.isDashboard) {
                //     console.log('added');
                // } else {
                    const path = '/app/feed/' + ev.feed_id;
                    browserHistory.push(path);
                // }
            },
            error: function (ev) {
                this.setState({
                    error: JSON.parse(ev.responseText).message
                });
            }
        });
    },

    _validate:function(){

        var urlRegexTest = /(http:\/\/|https:\/\/|)(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/.test(this.state.videoUrl);

        if (urlRegexTest) {
            this.setState({
                isValid:true,
                showInvalidMsg:false
            });
        } else {
            this.setState({
                isValid:false,
                showInvalidMsg:true
            });
        }
        if (!this.state.videoUrl) {
            this.setState({
                showInvalidMsg:false
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
                showInvalidMsg={this.state.showInvalidMsg}
                submitHandler={this._handleSubmit}
                value={this.state.videoUrl}
                changeHandler={this._handleUrlChange}
                error={this.state.error}
                isDashboard={this.state.isDashboard} />
        );
    }

});

module.exports = CreateFeedContainer;
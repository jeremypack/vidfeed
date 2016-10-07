import React from 'react';
import { browserHistory } from 'react-router';



module.exports =  React.createClass({
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
            <h1>Make timecoded notes on any video.</h1>
            <form className="form" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your YouTube or Vimeo URL"
                    value={this.state.videoUrl}
                    onChange={this.handleUrlChange} />
                <input type="submit" value="Create Feed"/>
            </form>
            <div>{this.state.feedDetails}</div>
            <label>{this.state.error}</label>
        </div>
    );
  }
});
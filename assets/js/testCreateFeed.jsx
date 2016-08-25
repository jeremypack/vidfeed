var React = require('react');

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
        this.setState({error: '', videoUrl: '', feedDetails: JSON.stringify(ev)});
      },
      error: function (ev) {
        this.setState({error: JSON.parse(ev.responseText).message, feedDetails: ''});
      }
    });
  },
  render: function() {
    return (
      <div>
        <form className="loginForm" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Enter your YouTube or Vimeo URL"
            value={this.state.videoUrl}
            onChange={this.handleUrlChange}
          />
          <input type="submit" value="Create Feed"/>
        </form>
        <div>{this.state.feedDetails}</div>
        <lable>{this.state.error}</lable>
      </div>
    );
  }
});
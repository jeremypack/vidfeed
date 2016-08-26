var React = require('react');
import OwnFeed from './ownFeed';
import Comments from './comments';


var Feed = React.createClass({
  getInitialState: function() {
    return {
      created: "",
      owner: {},
      feed_id: "",
      provider: "",
      video_id: "",
      video_title: "",
      video_thumbnail: ""
    };
  },
  componentDidMount: function() {
    $.ajax({
      url: "/api/feeds/" + this.props.params.feedId,
      dataType: 'json',
      context: this,
      success: function(feed) {
        this.setState({
          created: feed.created,
          owner: feed.owner,
          feed_id: feed.feed_id,
          provider: feed.provider,
          video_id: feed.video_id,
          video_title: feed.video_title,
          video_thumbnail: feed.video_thumbnail
        });
      }
    });
  },
  render: function(){
    var videoUrl = 'https://www.youtube.com/embed/' + this.state.video_id;
    return (
      <div>
        <OwnFeed wait={10000} />
        <h3>Rendering a feed</h3>
        <iframe width="560" height="315" src={videoUrl} frameBorder="0" allowFullScreen></iframe>
        <p>created: {this.state.created}</p>
        <p>video title: {this.state.video_title}</p>
        <Comments url="/api/comments" pollInterval={2000} />
      </div>);
 }
});

module.exports = Feed;
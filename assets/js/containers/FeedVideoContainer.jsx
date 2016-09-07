var React = require('react');

var FeedVideo = require('../components/FeedVideo.jsx');

var FeedVideoContainer = React.createClass({

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
            url: "/api/feeds/" + this.props.feedId,
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

    render: function() {
        return (
            <div>
                <FeedVideo
                    srcId={this.state.video_id}
                    created={this.state.created}
                    title={this.state.video_title} />
            </div>
        );
    }
});

module.exports = FeedVideoContainer;
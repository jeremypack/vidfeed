var React = require('react');

var OwnFeedContainer = require('../containers/OwnFeedContainer');
var FeedVideoContainer = require('../containers/FeedVideoContainer');
var CommentsContainer = require('../containers/CommentsContainer');

var Feed = React.createClass({
    
    render: function() {
        var commentUrl = '/api/feeds/' + this.props.params.feedId + '/comments';
        return (
            <div>
                <OwnFeedContainer />
                <FeedVideoContainer feedId={this.props.params.feedId} />
                <CommentsContainer url={commentUrl} pollInterval={2000} />
            </div>
        );
    }

});

module.exports = Feed;
var React = require('react');

var OwnFeedContainer = require('../containers/OwnFeedContainer');
var FeedVideoContainer = require('../containers/FeedVideoContainer');
var CommentsContainer = require('../containers/CommentsContainer');

function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
}


var Feed = React.createClass({
    
    getInitialState: function() {
        return { timecode: '' }
    },

    getTimecode: function(timecode) {
        var timecodeNumber = hmsToSecondsOnly(timecode);
        this.setState({ timecode: timecodeNumber });
    },

    render: function() {
        var commentUrl = '/api/feeds/' + this.props.params.feedId + '/comments';
        return (
            <div>
                <OwnFeedContainer />
                <FeedVideoContainer feedId={this.props.params.feedId} onTimecodeChange={this.getTimecode} />
                <CommentsContainer url={commentUrl} pollInterval={2000} timecode={this.state.timecode} />
            </div>
        );
    }

});

module.exports = Feed;
var React = require('react');

var ShareFeedContainer = require('../containers/ShareFeedContainer');
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
        return { feed:[], timecode: '' };
    },

    componentDidMount: function() {
        $.ajax({
            url: "/api/feeds/" + this.props.params.feedId,
            dataType: 'json',
            context: this,
            success: function(data) {
                this.setState({ feed: data });
            }
        });
    },

    _getTimecode: function(timecode) {
        var timecodeNumber = hmsToSecondsOnly(timecode);
        this.setState({ timecode: timecodeNumber });
    },

    render: function() {
        if (!this.state.feed.owner) {
            var ownFeed = <OwnFeedContainer feedId={this.props.params.feedId} wait={5000} />
        }
        return (
            <div>
                <ShareFeedContainer />
                {ownFeed}
                <FeedVideoContainer feedId={this.props.params.feedId} onTimecodeChange={this._getTimecode} />
                <CommentsContainer feedId={this.props.params.feedId} pollInterval={2000} timecode={this.state.timecode} />
            </div>
        );
    }

});

module.exports = Feed;
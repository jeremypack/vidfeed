var React = require('react');

var HeaderContainer =           require('../containers/HeaderContainer');
var ShareFeedContainer =        require('../containers/ShareFeedContainer');
var OwnFeedContainer =          require('../containers/OwnFeedContainer');
var FeedVideoContainer =        require('../containers/FeedVideoContainer');
var CommentsContainer =         require('../containers/CommentsContainer');

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
        return {
            feed:[],
            timecode:null,
            blur:false,
            shareModal:false,
        };
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

    _shareModalOpen: function(e) {
        e.preventDefault();
        this.setState({
            shareModal:true
        });
        this._modalOpen();
    },

    _modalOpen: function(e) {
        this.setState({
            blur:true
        });
    },

    _modalClose: function() {
        this.setState({
            shareModal:false,
            blur:false
        });
    },

    render: function() {
        
        if (!this.state.feed.owner) {
            var ownFeed = <OwnFeedContainer
                            modalOpen={this._modalOpen}
                            modalClose={this._modalClose}
                            feedId={this.props.params.feedId}
                            wait={5000} />
        } else {
            var ownFeed = undefined;
        }

        if (this.state.shareModal) {
            var shareFeed = <ShareFeedContainer
                                modalOpen={this.state.shareModal}
                                modalClose={this._modalClose} />
        } else {
            var shareFeed = undefined;
        }

        if (this.state.blur) {
            var blurClasses = 'blurLayer blurLayer--active';
        } else {
            var blurClasses = 'blurLayer';
        }
        
        return (
            <div>
                <div className={blurClasses}>
                    <HeaderContainer />
                    <section className="feedInfo u-clearfix">
                        <h1 className="lede float--left">{this.state.feed.video_title}</h1>
                        <a href="#" onClick={this._shareModalOpen} className="c-btn c-btn--tertiary float--right">Share</a>
                    </section>
                    <FeedVideoContainer
                        feedId={this.props.params.feedId}
                        onTimecodeChange={this._getTimecode} />
                    <p id="timecode">&nbsp;</p>
                    <CommentsContainer
                        feedId={this.props.params.feedId}
                        pollInterval={2000}
                        timecode={this.state.timecode} />
                </div>
                {shareFeed}
                {ownFeed}
            </div>
        );
    }

});

module.exports = Feed;
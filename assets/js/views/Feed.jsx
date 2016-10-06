var React = require('react');

var HeaderContainer =           require('../containers/HeaderContainer');
var ShareFeedContainer =        require('../containers/ShareFeedContainer');
var OwnFeedContainer =          require('../containers/OwnFeedContainer');
var FeedVideoContainer =        require('../containers/FeedVideoContainer');
var CommentFormContainer =      require('../containers/CommentFormContainer');
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
            owner:undefined,
            timecode:0,
            timecodeSeconds:0,
            blur:false,
            shareModal:false,
            commentsOpen:false
        };
    },

    componentDidMount: function() {
        $.ajax({
            url: "/api/feeds/" + this.props.params.feedId,
            dataType: 'json',
            context: this,
            success: function(data) {
                this.setState({ 
                    feed: data,
                    owner: data.owner
                });
            }
        });
        this._resizeContent();
        window.addEventListener('resize', this._resizeContent);
        // setInterval(this._resizeContent, 1000);
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this._resizeContent);
    },

    _resizeContent : function() {
        var windowWidth = window.innerWidth;
        if (windowWidth < 740) {
            return
        }
        console.log(windowWidth, 'windowWidth');
        var drawerWidth = this.refs.drawer.clientWidth;
        console.log(drawerWidth,'dwarwiif');
        var remainingWidth = windowWidth - drawerWidth;
        console.log(remainingWidth,'remainingWidth');
        this.setState({ contentSpace: remainingWidth });
        console.log(this.state.contentSpace,'content space');
    },

    _getTimecode: function(timecode) {
        var timecodeInSeconds = hmsToSecondsOnly(timecode);
        this.setState({
            timecode: timecode,
            timecodeSeconds: timecodeInSeconds
        });
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

    _commentsToggle: function(e) {
        e.preventDefault();
        this.setState({
            commentsOpen:!this.state.commentsOpen
        });
    },

    render: function() {
        
        var ownFeed =   <OwnFeedContainer
                            modalOpen={this._modalOpen}
                            modalClose={this._modalClose}
                            feedOwner={this.state.owner}
                            feedId={this.props.params.feedId}
                            wait={5000} />

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

        if (this.state.commentsOpen) {
            var drawerClasses = 'o-offCanvas__drawer  o-offCanvas__drawer--open o-layout__item u-1/3@tablet u-1/4@desktop';
        } else {
            var drawerClasses = 'o-offCanvas__drawer o-layout__item';
        }

        return (
            <div>
                <div className={blurClasses}>
                    
                    <HeaderContainer ref="header" />
                    
                    <section ref="infoBar" className="feedInfo u-clearfix">
                        <h1 className="lede float--left">{this.state.feed.video_title}</h1>
                        <a href="#" onClick={this._shareModalOpen} className="o-btn o-btn--tertiary float--right">Share</a>
                    </section>
                    
                    <div className="o-offCanvas__outer o-layout o-layout--flush o-layout--center ">
                        <a href="#" className="o-offCanvas__open" onClick={this._commentsToggle}>open comments</a>
                        <div className="o-offCanvas__main o-layout__item u-2/3@tablet u-3/5@desktop"> 
                            <div className="o-offCanvas__main__inner">
                                <FeedVideoContainer
                                    feedId={this.props.params.feedId}
                                    onTimecodeChange={this._getTimecode} />
                
                                <CommentFormContainer
                                    feedId={this.props.params.feedId}
                                    timecode={this.state.timecode}
                                    timecodeSeconds={this.state.timecodeSeconds} />
                            </div>   
                        </div>
                        
                        <div ref="drawer" className={drawerClasses}>
                            <div className="o-offCanvas__drawer__inner">
                                <a href="#" className="o-offCanvas__close" onClick={this._commentsToggle}>&times;<span className="u-hidden-visually">Hide comments</span></a>
                                <CommentsContainer
                                    feedId={this.props.params.feedId}
                                    pollInterval={2000}
                                    timecode={this.state.timecodeSeconds} />
                            </div>
                            
                        </div>

                    </div>
                </div>
                {shareFeed}
                {ownFeed}
            </div>
        );
    }

});

module.exports = Feed;
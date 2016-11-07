var React = require('react');
var ReactPlayer = require('react-player');
var YouTubePlayer = require('../components/YouTubePlayer');

function pad (string) {
  return ('0' + string).slice(-2)
}

var FeedVideoContainer = React.createClass({

    propTypes: {
        feedId:                 React.PropTypes.string.isRequired,
        onTimecodeChange:       React.PropTypes.func.isRequired,
        seekToTime:             React.PropTypes.number
    },

    getInitialState: function() {
        return {
            created: "",
            owner: {},
            feed_id: "",
            provider: "",
            video_id: "",
            video_title: "",
            video_thumbnail: "",
            playing:false,
            played:0,
            duration:null,
            elapsed:0,
            loaded:0,
            lastSeek:undefined
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

    componentWillReceiveProps:function(nextProps) {
        if (nextProps.seekToTime != this.state.lastSeek) {
            this.setState({
                lastSeek:nextProps.seekToTime
            });
            this._seekTo(nextProps.seekToTime);
        }
    },

    _seekTo:function(number) {
        var fraction = number / this.state.duration;
        if (fraction === 0) {
            fraction = 0.0002;
        }
        this.refs.player.seekTo(fraction);
        this._onPause();
    },

    _isYoutube: function() {
        return this.state.provider.id === 1;
    },

    _onPlay: function() {
        window.vidfeed.playing = true;
    },
    _onPause: function() {
        window.vidfeed.playing = false;
    },

    _onDuration: function(data) {
        this.setState({
            duration:data
        });
    },

    _onProgress:function(data) {
        if(this.state.duration === 0) {
            // set duration to null so we don't trigger the event again
            // don't do this via setState because we don't want to
            // trigger a refresh in this instance
            this.state.duration = null;
            this.refs.player.refs.player.refs.iframe.contentWindow.postMessage('{"method":"getDuration", "value":0}', '*');
        } else {
             $('#timecode').text(this._calcElapsed(data.played * this.state.duration));
        }

        this.setState({
            loaded: data.loaded,
            played: data.played
        });
        this.state.elapsed = this._calcElapsed(this.state.played * this.state.duration);
        this.props.onTimecodeChange(this.state.elapsed);
    },

    _onYouTubeProgress:function(elapsed) {
        this.props.onTimecodeChange(this._calcElapsed(elapsed));
    },

    _calcElapsed: function(data) {
        var date = new Date(data * 1000)
        var hh = date.getHours()
        var mm = date.getMinutes()
        var ss = pad(date.getSeconds())
        if (hh) {
            return `${hh}:${pad(mm)}:${ss}`
        }
        return `${mm}:${ss}`
    },

    render: function() {
                
        if (this._isYoutube()) {
            return (
                <section className="c-player">
                    <div className="c-player__height">
                        <YouTubePlayer
                            video_id={this.state.video_id}
                            onProgress={this._onYouTubeProgress}/>
                    </div>
                </section>
            );
        } else {
            var vimeoUrl = "https://vimeo.com/"+this.state.video_id;
            var vimeoConfig = {
                iframeParams : {
                    color:'49c9f5'
                }
            };
            return (
                <section className="c-player">
                    <div className="c-player__height">
                        <ReactPlayer
                            controls
                            progressFrequency={100}
                            width='100%'
                            height='100%'
                            ref='player'
                            playing={window.vidfeed.playing}
                            url={vimeoUrl}
                            onPlay={this._onPlay} 
                            onPause={this._onPause}
                            onProgress={this._onProgress}
                            onDuration={this._onDuration}
                            vimeoConfig={vimeoConfig} />
                    </div>
                </section>
            );
        }
    }
});

module.exports = FeedVideoContainer;
var React = require('react');

var player;

var YouTubePlayer = React.createClass({
    
    propTypes: {
        video_id:               React.PropTypes.string.isRequired,
        onProgress:             React.PropTypes.func,
        onPlay:                 React.PropTypes.func,
        onPause:                React.PropTypes.func,
        homepage:               React.PropTypes.bool,
        playing:                React.PropTypes.bool,
        seekTo:                 React.PropTypes.number,
        playOnScroll:           React.PropTypes.bool
    },

    interval: null,

    getInitialState: function() {
        return {
            'video_id': 'wMAuk5D6h1w',
            lastSeek:undefined,
            playing:false
        }
    },

    componentWillMount: function () {
        window.yt_player_id = window.yt_player_id || 0;
        window.yt_player_id++;
    },

    componentDidMount: function() {
        
        
        window.onPlayerReady = function () {
            if (this.props.onProgress) {
                this.interval = setInterval(function() {
                    this.props.onProgress(player.getCurrentTime());
                }.bind(this), 100);
            }   
        }.bind(this);
        
        window.onPlayerStateChange = function (event) {
            switch(event.data) {
                case 0:
                    //console.log('video ended');
                break;
                case 1:
                    //console.log('video playing from '+player.getCurrentTime());
                    if (this.props.onPlay) {
                        this.props.onPlay();
                        this.setState({
                            playing:true
                        });
                    }
                    
                break;
                case 2:
                    //console.log('video paused at '+player.getCurrentTime());
                    if (this.props.onPause) {
                        this.props.onPause();
                        this.setState({
                            playing:false
                        });
                    }
            }
        }.bind(this);

        if (this.props.homepage) {
            var playerVars = {
                'controls': 0,
                'disablekb':1,
                'fs':0,
                'iv_load_policy':3,
                'modestbranding':1,
                'rel':0,
                'showinfo':0,
                'loop':1,
                'playlist':this.props.video_id
            }
        } else {
            var playerVars = {
                'disablekb':1,
                'iv_load_policy':3,
                'modestbranding':1,
                'rel':0,
                'showinfo':0,
            }
        }

        if (window.yt_player_id === 1) {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = function () {
                player = new YT.Player('yt_player_' + window.yt_player_id, {
                    width: '100%',
                    height: '100%',
                    playerVars: playerVars,
                    videoId: this.props.video_id,
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            }.bind(this);
        } else {
            player = new YT.Player('yt_player_' + window.yt_player_id, {
                width: '100%',
                height: '100%',
                videoId: this.props.video_id,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

    },

    componentWillReceiveProps:function(nextProps) {
        if (player) {
            if (!nextProps.playing && this.state.playing) {
                this._pauseVideo();
            }
            if (nextProps.seekTo != this.state.lastSeek) {
                this.setState({
                    lastSeek:nextProps.seekTo
                });
                this._seekTo(nextProps.seekTo);
            }
            if (nextProps.playOnScroll) {
                this._playVideo();
            }
        }
    },

    componentWillUnmount: function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    },

    _playVideo:function() {
        player.playVideo();
    },

    _pauseVideo:function() {
        player.pauseVideo();
    },

    _seekTo: function(seconds) {
        player.seekTo(seconds);
    },

    render: function() {
        const playerId = "yt_player_" + window.yt_player_id;
        return (
                <div style={{"height" : "100%", "width" : "100%"}}>
                    <div style={{"height" : "100%", "display" : "block"}}>
                        <div id={playerId}></div>
                    </div>
                </div>)
    }
});

module.exports = YouTubePlayer;
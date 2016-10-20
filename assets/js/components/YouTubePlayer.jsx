var React = require('react');

var YouTubePlayer = React.createClass({

    getInitialState: function() {
        return {
            'video_id': 'wMAuk5D6h1w'
        }
    },

    componentDidMount: function() {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        var player;
        window.onPlayerReady = function () {
          setInterval(function() { 
            this.props.onProgress(player.getCurrentTime());
          }.bind(this), 100);
        }.bind(this);
        window.onPlayerStateChange = function () {
          console.log('player state changed');
        };
        window.onYouTubeIframeAPIReady = function () {
          player = new YT.Player('yt_player', {
            width:'100%',
            height:'100%',
            videoId: this.props.video_id,
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });
        }.bind(this);
    },

    render: function() {
        return (
                <div style={{"height" : "100%", "width" : "100%"}}>
                    <div style={{"height" : "100%", "display" : "block"}}>
                        <div id="yt_player"></div>
                    </div>
                </div>)
    }
});

module.exports = YouTubePlayer;
var React = require('react');

var YouTubePlayer = React.createClass({
    interval: null,
    getInitialState: function() {
        return {
            'video_id': 'wMAuk5D6h1w'
        }
    },

    componentWillMount: function () {
        window.yt_player_id = window.yt_player_id || 0;
        window.yt_player_id++;
    },

    componentDidMount: function() {
        var player;
        window.onPlayerReady = function () {
          this.interval = setInterval(function() {
            this.props.onProgress(player.getCurrentTime());
          }.bind(this), 100);
        }.bind(this);
        window.onPlayerStateChange = function () {
          console.log('player state changed');
        };

        if (window.yt_player_id === 1) {
          var tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          window.onYouTubeIframeAPIReady = function () {
            player = new YT.Player('yt_player_' + window.yt_player_id, {
              width: '100%',
              height: '100%',
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

    componentWillUnmount: function () {
      if(this.interval){
        clearInterval(this.interval);
      }
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
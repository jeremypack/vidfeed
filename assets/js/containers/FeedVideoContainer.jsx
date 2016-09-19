var React = require('react');
var ReactPlayer = require('react-player');

function pad (string) {
  return ('0' + string).slice(-2)
}


var FeedVideoContainer = React.createClass({

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
            duration:0,
            elapsed:0,
            loaded:0
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

    isYoutube: function() {
        if (this.state.provider.id === 1) {
            return true;
        } else {
            return false;
        }
    },

    playPause: function() {
        if (this.state.playing) {
            this.setState({playing:false});
        } else {
            this.setState({playing:true});
        }
    },

    onDuration: function(data) {
        this.setState({duration:data});
    },

    onProgress:function(data) {
        this.setState({
            loaded: data.loaded,
            played: data.played
        });
        this.state.elapsed = this.calcElapsed(this.state.played * this.state.duration);
        this.props.onTimecodeChange(this.state.elapsed);
    },

    calcElapsed: function(data) {
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
        if (this.isYoutube()) {
            var youtubeUrl = "https://www.youtube.com/watch?v="+this.state.video_id;
            var youtubeConfig = {
                preload:true
            };
            return (
                <div>
                    <ReactPlayer
                        controls
                        progressFrequency={100}
                        url={youtubeUrl}
                        onPlay={this.playPause} 
                        onPause={this.playPause}
                        onProgress={this.onProgress}
                        onDuration={this.onDuration}
                        youtubeConfig={youtubeConfig} />
                    <p>{this.state.elapsed}</p>
                </div>
            );
        } else {
            var vimeoUrl = "https://vimeo.com/"+this.state.video_id;
            return (
                <div>
                    <ReactPlayer
                        progressFrequency={50}
                        url={vimeoUrl}
                        onPlay={this.playPause} 
                        onPause={this.playPause}
                        onProgress={this.onProgress}
                        onDuration={this.onDuration} />
                    <p>{this.state.elapsed}</p>
                </div>
            );
        }
    }
});

module.exports = FeedVideoContainer;
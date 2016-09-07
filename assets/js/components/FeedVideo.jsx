var React = require('react');

var FeedVideo = React.createClass({
    render: function() {
        var videoUrl = 'https://www.youtube.com/embed/' + this.props.srcId;
        return (
            <div>
                <iframe width="560" height="315" src={videoUrl} frameBorder="0" allowFullScreen></iframe>
                <p>created: {this.props.created}</p>
                <p>video title: {this.props.title}</p>
            </div>
        );
    }
});

module.exports = FeedVideo;

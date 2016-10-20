var React = require('react');


var FeedVideo = React.createClass({    
    render: function() {
        var src = "http://www.youtube.com/embed/" + 
            this.props.videoid + "?autoplay=" + 
            this.props.autoplay + "&rel=" + 
            this.props.rel + "&modestbranding=" +
            this.props.modest;

        return (
            <div className="player">
                <iframe className="player" type="text/html" width="100%" height="100%" src={src} frameBorder="0"/>
            </div>
        );
    }
});

var Comments = React.createClass({
    getInitialState: function () {
        return { 
            timeStamp:     '',
            newComment:    '',
            author:        '',
            comments:      ''
        };
    },
    componentDidMount: function() {
        this.setState({
            comments:this.props.list
        });
    },
    handleCommentChange: function(e) {
       this.setState({newComment: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        alert(this.state.newComment,'submittted');
        this.setState({
            comments:this.props.list
        });
        console.log(this.state.comments,'this.state.comments');
    },
    render: function(){
        return (
            <div>
                <form className="comment" onSubmit={this.handleSubmit}>
                    <span className="timeStamp">0:00</span>
                    <textarea onChange={this.handleCommentChange}></textarea>
                    <button>Submit</button>
                </form>
                <CommentList list={this.props.list} />
            </div>
        );
    }
});

var Comment = React.createClass({
    render: function() {
        return (
            <div className="comment">
                <span>{this.props.name}</span>
                <span>{this.props.comment}</span>
                <span>{this.props.time}</span>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function(){
        var _data = this.props.list;
        var count = _data.length;
        return (
            <div className="comments">
                <p><strong>{count}</strong> Comments</p>
                {_data.map(function(result, i) {
                   return <Comment key={i} name={result.author} comment={result.text} time={result.timeStamp} />;
                })}
            </div>
        );
    }
});

var Feed = React.createClass({
    getInitialState: function () {
        return { 
            id:         'DZEBoA9wIUc',
            comments:   []
        };
    },
    componentDidMount: function() {
        this.setState({comments: [
          {id: 1, text: 'test comment 1', author: 'test author 1', timeStamp:0.45},
          {id: 2, text: 'test comment 2', author: 'test author 2', timeStamp:1.25},
          {id: 3, text: 'test comment 3', author: 'test author 3', timeStamp:3.33}
        ]});
    },
    render: function() {
        return (
            <div>
                <h1>Feed title</h1>
                <FeedVideo videoid={this.state.id} autoplay="0" rel="0" modest="1" />
                <Comments list={this.state.comments} />
            </div>
        );
    }
});

module.exports = Feed;
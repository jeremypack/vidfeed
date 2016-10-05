var React = require('react');

var EditComment = React.createClass({
    
    render: function() {
        return (
            <article className="c-comment c-comment--edit" data-id={this.props.id}>
                <div className="u-clearfix">
                    <p className="c-comment__author">{this.props.author}</p>
                    {this.props.isReply ? null : <p className="c-comment__timecode">{this.props.timecode}</p> }
                </div>
                <div className="c-comment__body">
                    <input type="text" onChange={this.props.handleChange} value={this.props.value} />
                </div>
                <a onClick={this.props.saveChange} href="#">save</a>&nbsp;&nbsp;
                <a onClick={this.props.cancelChange} href="#">cancel</a>
            </article>
        );
    }

});

module.exports = EditComment;
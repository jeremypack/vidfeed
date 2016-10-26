var React = require('react');
import FormattedRelativeDate from 'react-npm-formatted-relative-date';

var User = require('../components/User');

var Comment = React.createClass({
    
    propTypes: {
        id:                    React.PropTypes.number.isRequired,
        author:                React.PropTypes.string.isRequired,
        value:                 React.PropTypes.string.isRequired,
        isReply:               React.PropTypes.bool.isRequired,
        timecode:              React.PropTypes.string,
        created:               React.PropTypes.string.isRequired,
        replyIsOpen:           React.PropTypes.bool,
        toggleReply:           React.PropTypes.func,
        editComment:           React.PropTypes.func,
        deleteComment:         React.PropTypes.func
    },

    render: function() {
        var replyToggleText = this.props.replyIsOpen ? 'Hide reply' : 'Reply';
        var replyClass = this.props.isReply ? 'c-comment c-comment--reply' : 'c-comment';

        if (this.props.editComment) {
            var commentActions = <div className="c-comment__actions">
                                    <ul className="o-list-inline">
                                        {this.props.isReply ? null : <li className="o-list-inline__item"><a title="Reply" onClick={this.props.toggleReply} href="#"><i className="icon icon--replyArrow"></i><span className="u-hidden-visually">{replyToggleText}</span></a></li> }
                                        <li className="o-list-inline__item"><a title="Edit comment" onClick={this.props.editComment} href="#"><i className="icon icon--pencil"></i><span className="u-hidden-visually">edit</span></a></li>
                                        <li className="o-list-inline__item"><a title="Delete comment" onClick={this.props.deleteComment} href="#"><i className="icon icon--cross"></i><span className="u-hidden-visually">delete</span></a></li>
                                    </ul> 
                                </div>;
        } else {
            var commentActions = <div className="c-comment__actions">
                                    <ul className="o-list-inline">
                                        {this.props.isReply ? null : <li className="o-list-inline__item"><a onClick={this.props.toggleReply} href="#"><i className="icon icon--replyArrow"></i><span className="u-hidden-visually">{replyToggleText}</span></a></li> }
                                    </ul> 
                                </div>;
        }

        return (
            <article className={replyClass} data-id={this.props.id}>
                <div className="u-clearfix">
                    <div className="c-comment__author">
                        <User userEmail={this.props.author} />
                    </div>
                    {this.props.isReply ? null : <p className="c-comment__timecode">{this.props.timecode}</p> }
                </div>
                <div className="c-comment__body">
                    {this.props.value}
                    <div className="u-clearfix">
                        {commentActions}
                        <div className="c-comment__created">
                            <FormattedRelativeDate date={this.props.created} />
                        </div>
                    </div>
                </div>
            </article>
        );
    }

});

module.exports = Comment;
var React = require('react');
var classNames = require('classnames');
import Linkify from 'react-linkify';
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
        deleteComment:         React.PropTypes.func,
        timecodeClick:         React.PropTypes.func
    },

    render: function() {
        var replyToggleText = this.props.replyIsOpen ? 'Hide reply' : 'Reply';

        var commentClasses = classNames({
            'c-comment':true,
            'c-comment--reply':this.props.isReply,
            'c-comment--fresh':this.props.newComment
        });

        if (this.props.editComment) {
            var commentActions = <div className="c-comment__actions">
                                    <ul className="o-list-inline">
                                        <li className="o-list-inline__item"><a title="Reply" onClick={this.props.toggleReply} href="#"><i className="icon icon--replyArrow"></i><span className="u-hidden-visually">{replyToggleText}</span></a></li>
                                        <li className="o-list-inline__item"><a title="Edit comment" onClick={this.props.editComment} href="#"><i className="icon icon--pencil"></i><span className="u-hidden-visually">edit</span></a></li>
                                        <li className="o-list-inline__item"><a title="Delete comment" onClick={this.props.deleteComment} href="#"><i className="icon icon--cross"></i><span className="u-hidden-visually">delete</span></a></li>
                                    </ul> 
                                </div>;
        } else {
            var commentActions = <div className="c-comment__actions">
                                    <ul className="o-list-inline">
                                        <li className="o-list-inline__item"><a onClick={this.props.toggleReply} href="#"><i className="icon icon--replyArrow"></i><span className="u-hidden-visually">{replyToggleText}</span></a></li>
                                    </ul> 
                                </div>;
        }

        return (
            <article className={commentClasses} data-id={this.props.id}>
                <div className="u-clearfix">
                    <div className="c-comment__author">
                        <User userEmail={this.props.author} />
                    </div>
                    {this.props.isReply ? null : <a href="#" onClick={this.props.timecodeClick} className="c-comment__timecode">{this.props.timecode}</a> }
                </div>
                <div className="c-comment__body">
                    <Linkify properties={{target: '_blank'}}>
                        {this.props.value}
                    </Linkify>
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
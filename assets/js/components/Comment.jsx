import React from 'react';
import classNames from 'classnames';
import Linkify from 'react-linkify';
import FormattedRelativeDate from 'react-npm-formatted-relative-date';

import User from '../components/User';

const Comment = React.createClass({
    
    propTypes: {
        id:                    React.PropTypes.number.isRequired,
        author:                React.PropTypes.string.isRequired,
        authorId:              React.PropTypes.number.isRequired,
        value:                 React.PropTypes.string.isRequired,
        isReply:               React.PropTypes.bool.isRequired,
        timecode:              React.PropTypes.string,
        created:               React.PropTypes.string.isRequired,
        replyIsOpen:           React.PropTypes.bool,
        toggleReply:           React.PropTypes.func,
        editComment:           React.PropTypes.func,
        deleteComment:         React.PropTypes.func,
        handleLockHoverEnter:  React.PropTypes.func,
        handleLockHoverLeave:  React.PropTypes.func,
        handleLockClick:       React.PropTypes.func,
        lockHover:             React.PropTypes.bool,
        isLocked:              React.PropTypes.bool
    },

    render: function() {
        var replyToggleText = this.props.replyIsOpen ? 'Hide reply' : 'Reply';

        var commentClasses = classNames({
            'c-comment':true,
            'c-comment--reply':this.props.isReply,
            'c-comment--fresh':this.props.newComment,
            'c-comment--locked':this.props.isLocked
        });

        var lockBtnClasses = classNames({
            'c-comment__lockBtn':true,
            'c-comment__lockBtn--unlocked':!this.props.isLocked,
            'c-comment__lockBtn--locked':this.props.isLocked
        });

        var lockIconClasses = classNames({
            'icon icon--tick':true,
            'icon--tick':!this.props.isLocked,
            'icon--tickBlue':!this.props.isLocked && this.props.lockHover,
            'icon--tickWhite':this.props.isLocked
        });

        if (!this.props.isLocked) {
            if (this.props.editComment) {
                var commentActions = <div className="c-comment__actions">
                                        <ul className="o-list-inline">
                                            <li className="o-list-inline__item"><a className="c-comment__toggleReply" title="Reply" onClick={this.props.toggleReply} href="#"><i className="icon icon--replyArrow"></i><span className="u-hidden-visually">{replyToggleText}</span></a></li>
                                            <li className="o-list-inline__item"><a className="c-comment__editComment" title="Edit comment" onClick={this.props.editComment} href="#"><i className="icon icon--pencil"></i><span className="u-hidden-visually">edit</span></a></li>
                                            <li className="o-list-inline__item"><a className="c-comment__deleteComment" title="Delete comment" onClick={this.props.deleteComment} href="#"><i className="icon icon--cross"></i><span className="u-hidden-visually">delete</span></a></li>
                                        </ul> 
                                    </div>;
            } else {
                var commentActions = <div className="c-comment__actions">
                                        <ul className="o-list-inline">
                                            <li className="o-list-inline__item"><a className="c-comment__toggleReply" onClick={this.props.toggleReply} href="#"><i className="icon icon--replyArrow"></i><span className="u-hidden-visually">{replyToggleText}</span></a></li>
                                        </ul> 
                                    </div>;
            }
        }
        

        return (
            <article className={commentClasses} data-id={this.props.id}>
                <div className="u-clearfix">
                    <div className="c-comment__author">
                        <User id={this.props.authorId} userEmail={this.props.author} />
                    </div>
                    { this.props.isReply ? null : <a href="#" className="c-comment__timecode">{this.props.timecode}</a> }
                </div>
                <div className="c-comment__body">
                    <Linkify properties={{target: '_blank'}}>
                        {this.props.value}
                    </Linkify>
                </div>
                <div className="c-comment__footer u-clearfix">
                    { this.props.isReply ? null : <a href="#" onClick={this.props.handleLockClick} onMouseEnter={this.props.handleLockHoverEnter} onMouseLeave={this.props.handleLockHoverLeave} className={lockBtnClasses}><i className={lockIconClasses}></i><span className="u-hidden-visually">{ this.props.isLocked ? 'Unlock' : 'Lock' }</span></a> }
                    {commentActions}
                    <div className="c-comment__created">
                        <FormattedRelativeDate date={this.props.created} />
                    </div>
                </div>
            </article>
        );
    }

});

module.exports = Comment;
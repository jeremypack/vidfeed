import React from 'react';
import FormattedRelativeDate from 'react-npm-formatted-relative-date';

import User from '../components/User';

const EditComment = React.createClass({
    
    propTypes: {
        id:                    React.PropTypes.number.isRequired,
        authorId:              React.PropTypes.number.isRequired,
        author:                React.PropTypes.string.isRequired,
        value:                 React.PropTypes.string.isRequired,
        isReply:               React.PropTypes.bool.isRequired,
        timecode:              React.PropTypes.string,
        created:               React.PropTypes.string.isRequired,
        handleChange:          React.PropTypes.func,
        handleSubmit:          React.PropTypes.func,
        cancelChange:          React.PropTypes.func,
        timecodeClick:         React.PropTypes.func
    },

    render: function() {
        var replyClass = this.props.isReply ? 'c-comment c-comment--edit c-comment--reply' : 'c-comment c-comment--edit';

        return (
            <article className={replyClass} data-id={this.props.id}>
                <div className="u-clearfix">
                    <div className="c-comment__author">
                        <User id={this.props.authorId} userEmail={this.props.author} />
                    </div>
                    {this.props.isReply ? null : <a href="#" onClick={this.props.timecodeClick} className="c-comment__timecode">{this.props.timecode}</a> }
                </div>
                <form onSubmit={this.props.handleSubmit} className="c-comment__body form--border">
                    <input className="input--border input--edit" type="text" onChange={this.props.handleChange} value={this.props.value} />
                    <div className="u-clearfix">
                        <div className="c-comment__actions">
                            <ul className="o-list-inline">
                                <li className="o-list-inline__item"><input type="submit" className="icon icon--tick" title="Save change" value="Save change" /></li>
                                <li className="o-list-inline__item"><a title="Cancel change" onClick={this.props.cancelChange} href="#"><i className="icon icon--cross"></i><span className="u-hidden-visually">Cancel</span></a></li>
                            </ul> 
                        </div>
                        <div className="c-comment__created">
                            <FormattedRelativeDate date={this.props.created} />
                        </div>
                    </div>
                </form>
            </article>
        );
    }

});

module.exports = EditComment;
import React from 'react';
import FormattedRelativeDate from 'react-npm-formatted-relative-date';

import User from '../components/User';
import Actions from '../components/Actions';

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
        cancelChange:          React.PropTypes.func
    },

    componentDidMount: function() {
        this.refs.editInput.focus();
    },

    render: function() {
        var replyClass = this.props.isReply ? 'c-comment c-comment--edit c-comment--reply' : 'c-comment c-comment--edit';

        return (
            <article className={replyClass} data-id={this.props.id}>
                <div className="u-clearfix">
                    <div className="c-comment__author">
                        <User id={this.props.authorId} userEmail={this.props.author} />
                    </div>
                    {this.props.isReply ? null : <a href="#" className="c-comment__timecode">{this.props.timecode}</a> }
                </div>
                <form onSubmit={this.props.handleSubmit} className="form--border">
                    <div className="c-comment__body">
                        <input ref="editInput" className="input--edit" type="text" onChange={this.props.handleChange} value={this.props.value} />
                    </div>
                    <div className="u-clearfix">
                        <Actions
                            saveAction={this.props.handleSubmit} 
                            cancelAction={this.props.cancelChange} />
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
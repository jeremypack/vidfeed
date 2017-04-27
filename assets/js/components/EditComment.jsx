import React from 'react';
import FormattedRelativeDate from 'react-npm-formatted-relative-date';
import classNames from 'classnames';

import User from '../components/User';
import ContentEditable from '../components/ContentEditable';
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
        cancelChange:          React.PropTypes.func,
        isValid:               React.PropTypes.bool
    },

    // componentDidMount:function(){
    //     this.refs.editInput.focus();
    // },

    render: function() {
        
        var commentClasses = classNames({
            'c-comment c-comment--edit':true,
            'c-comment--reply': this.props.isReply
        })

        return (
            <article className={commentClasses} data-id={this.props.id}>
                <div className="u-clearfix">
                    <div className="c-comment__author">
                        <User id={this.props.authorId} userEmail={this.props.author} />
                    </div>
                    {this.props.isReply ? null : <a href="#" className="c-comment__timecode">{this.props.timecode}</a> }
                </div>
                <form onSubmit={this.props.handleSubmit} className="form--border">
                    <div className="c-comment__body">
                        <ContentEditable html={this.props.value} onChange={this.props.handleChange} />
                    </div>
                    <div className="u-clearfix">
                        <Actions
                            isValid={this.props.isValid}
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
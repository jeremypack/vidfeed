var React = require('react');
import FormattedRelativeDate from 'react-npm-formatted-relative-date';

var User = require('../components/User');

var EditComment = React.createClass({
    
    propTypes: {
        id:                    React.PropTypes.number.isRequired,
        author:                React.PropTypes.string.isRequired,
        value:                 React.PropTypes.string.isRequired,
        isReply:               React.PropTypes.bool.isRequired,
        timecode:              React.PropTypes.string,
        created:               React.PropTypes.string.isRequired,
        handleChange:          React.PropTypes.func,
        saveChange:            React.PropTypes.func,
        cancelChange:          React.PropTypes.func
    },

    render: function() {
        var replyClass = this.props.isReply ? 'c-comment c-comment--edit c-comment--reply' : 'c-comment c-comment--edit';

        var actions =   <div className="c-comment__actions">
                            <ul className="o-list-inline">
                                <li className="o-list-inline__item"><a title="Save change" onClick={this.props.saveChange} href="#"><i className="icon icon--tick"></i><span className="u-hidden-visually">Save</span></a></li>
                                <li className="o-list-inline__item"><a title="Cancel change" onClick={this.props.cancelChange} href="#"><i className="icon icon--cross"></i><span className="u-hidden-visually">Cancel</span></a></li>
                            </ul> 
                        </div>;

        return (
            <article className={replyClass} data-id={this.props.id}>
                <div className="u-clearfix">
                    <div className="c-comment__author">
                        <User userEmail={this.props.author} />
                    </div>
                    {this.props.isReply ? null : <p className="c-comment__timecode">{this.props.timecode}</p> }
                </div>
                <div className="c-comment__body form--border">
                    <input className="input--border input--edit" type="text" onChange={this.props.handleChange} value={this.props.value} />
                    <div className="u-clearfix">
                        {actions}
                        <div className="c-comment__created">
                            <FormattedRelativeDate date={this.props.created} />
                        </div>
                    </div>
                </div>
            </article>
        );
    }

});

module.exports = EditComment;
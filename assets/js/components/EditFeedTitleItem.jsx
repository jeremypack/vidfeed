import React from 'react';
import FormattedRelativeDate from 'react-npm-formatted-relative-date';

import Actions from '../components/Actions';

const EditFeedTitleItem = React.createClass({

    propTypes: {
        handleChange:          React.PropTypes.func.isRequired, 
        imgClasses:            React.PropTypes.string.isRequired,
        feedTitle:             React.PropTypes.string.isRequired,
        videoThumb:            React.PropTypes.string.isRequired,
        created:               React.PropTypes.string.isRequired,
        isValid:               React.PropTypes.bool.isRequired,
        saveEdit:              React.PropTypes.func.isRequired,
        cancelEdit:            React.PropTypes.func.isRequired
    },

    componentDidMount:function() {
        this.refs.input.focus();
    },

    render: function() {

        return (
            <div>
                <article className="c-feedItem">
                    <div className={this.props.imgClasses}>
                        <img src={this.props.videoThumb} alt={this.props.feedTitle} />
                    </div>
                    <div className="u-padding-small u-padding-bottom">
                        <input ref="input" type="text" onChange={this.props.handleChange} className="c-feedItem__title c-feedItem__title--edit contenteditable" value={this.props.feedTitle} />
                        <Actions
                            isValid={this.props.isValid}
                            saveAction={this.props.saveEdit} 
                            cancelAction={this.props.cancelEdit} />
                        <span className="c-feedItem__created"><FormattedRelativeDate date={this.props.created} /></span>
                    </div>
                </article>
            </div>
        );
    }

});

module.exports = EditFeedTitleItem;
import React from 'react';
import FormattedRelativeDate from 'react-npm-formatted-relative-date';

const FeedListItem = React.createClass({

    propTypes: {
        feedId:                React.PropTypes.string.isRequired,
        videoTitle:            React.PropTypes.string.isRequired,
        videoThumb:            React.PropTypes.string.isRequired,
        created:               React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            <div className="o-layout__item  u-1/2 u-1/3@tablet u-1/4@desktop">
                <article className="c-feedList__item">
                    <img src={this.props.videoThumb} alt={this.props.videoTitle} />
                    <div>{this.props.feedId}</div>
                    <div>{this.props.videoTitle}</div>
                    <div><FormattedRelativeDate date={this.props.created} /></div>
                </article>
            </div>
        );
    }

});

module.exports = FeedListItem;
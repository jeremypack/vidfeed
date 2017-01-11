import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import classNames from 'classnames';
import FormattedRelativeDate from 'react-npm-formatted-relative-date';

const FeedListItem = React.createClass({

    propTypes: {
        feedId:                React.PropTypes.string.isRequired,
        isVimeo:               React.PropTypes.bool.isRequired,
        videoTitle:            React.PropTypes.string.isRequired,
        videoThumb:            React.PropTypes.string.isRequired,
        created:               React.PropTypes.string.isRequired
    },

    render: function() {

        var imgCropClasses = classNames({
            'imgCrop': true,
            'imgCrop--letterbox':this.props.isVimeo
        });

        var feedRouterLink = '/app/feed/'+this.props.feedId;

        return (
            <div className="o-layout__item  u-1/2 u-1/3@tablet u-1/4@desktop">
                <Link to={feedRouterLink}>
                    <article className="c-feedItem">
                        <div className={imgCropClasses}>
                            <img src={this.props.videoThumb} alt={this.props.videoTitle} />
                        </div>
                        <div className="u-padding-small u-padding-bottom-large">
                            <span className="c-feedItem__title">{this.props.videoTitle}</span>
                            <span className="c-feedItem__created"><FormattedRelativeDate className="" date={this.props.created} /></span>
                        </div>
                    </article>
                </Link>
            </div>
        );
    }

});

module.exports = FeedListItem;
import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import FormattedRelativeDate from 'react-npm-formatted-relative-date';

import Actions from '../components/Actions';

const FeedListItem = React.createClass({

    propTypes: {
        route:                 React.PropTypes.string.isRequired,
        imgClasses:            React.PropTypes.string.isRequired,
        feedTitle:             React.PropTypes.string.isRequired,
        videoThumb:            React.PropTypes.string.isRequired,
        created:               React.PropTypes.string.isRequired,
        moveToProject:         React.PropTypes.func.isRequired,
        editFeedTitle:         React.PropTypes.func.isRequired,
        deleteFeed:            React.PropTypes.func.isRequired,
        noTitle:               React.PropTypes.bool.isRequired
    },

    render: function() {

        return (
            <div>
                <Link to={this.props.route}>
                    <article className="c-feedItem c-feedItem--active">
                        <div className={this.props.imgClasses}>
                            <div className="c-feedItem__stats">
                                <ul className="o-list-inline">
                                    <li className="o-list-inline__item"><span className="c-feedItem__stats__count">{this.props.collaboratorCount}</span><i className="icon icon--userDark"></i></li>
                                    <li className="o-list-inline__item"><span className="c-feedItem__stats__count">{this.props.commentCount}</span><i className="icon icon--bubbleDark"></i></li>
                                </ul>
                            </div>
                            <img src={this.props.videoThumb} alt={this.props.feedTitle} />
                        </div>
                        <div className="u-padding-small u-padding-bottom">
                            <span className={ this.props.noTitle ? "c-feedItem__title c-feedItem__title--noTitle" : "c-feedItem__title"}>{this.props.feedTitle}</span>
                            <Actions
                                addAction={this.props.moveToProject}
                                editAction={this.props.editFeedTitle}
                                deleteAction={this.props.deleteFeed} />
                            <span className="c-feedItem__created"><FormattedRelativeDate date={this.props.created} /></span>
                        </div>
                    </article>
                </Link>
            </div>
        );
    }

});

module.exports = FeedListItem;
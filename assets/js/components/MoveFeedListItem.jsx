import React from 'react';
import classNames from 'classnames'

const MoveFeedListItem = React.createClass({

    propTypes: {
        imgClasses:            React.PropTypes.string.isRequired,
        feedTitle:             React.PropTypes.string.isRequired,
        videoThumb:            React.PropTypes.string.isRequired,
        handleClick:           React.PropTypes.func.isRequired,
        selected:              React.PropTypes.bool.isRequired,
        handleFeedHoverEnter:  React.PropTypes.func.isRequired,
        handleFeedHoverLeave:  React.PropTypes.func.isRequired,
        feedHover:             React.PropTypes.bool.isRequired,
        noTitle:               React.PropTypes.bool.isRequired
    },

    render: function() {

        var feedClasses = classNames({
            'c-feedItem': true,
            'c-feedItem--selected':this.props.selected
        });

        var tickBtnClasses = classNames({
            'c-feedItem__tick':true,
            'c-feedItem__tick--unselected':!this.props.selected,
            'c-feedItem__tick--selected':this.props.selected
        });

        var tickIconClasses = classNames({
            'icon':true,
            'icon--tickWhite':this.props.selected,
            'icon--tickBlue':!this.props.selected && this.props.feedHover
        });

        return (
            <div>
                <a href="#" onClick={this.props.handleClick} onMouseEnter={this.props.handleFeedHoverEnter} onMouseLeave={this.props.handleFeedHoverLeave}>
                    <article className={feedClasses}>
                        <div className={tickBtnClasses}><i className={tickIconClasses}></i><span className="u-hidden-visually">{ this.props.selected ? 'Unselect' : 'Select' }</span></div>
                        <div className={this.props.imgClasses}>
                            <img src={this.props.videoThumb} alt={this.props.feedTitle} />
                        </div>
                        <div className="u-padding-small u-padding-bottom">
                            <span className={ this.props.noTitle ? "c-feedItem__title c-feedItem__title--noTitle" : "c-feedItem__title"}>{this.props.feedTitle}</span>
                        </div>
                    </article>
                </a>
            </div>
        );
    }

});

module.exports = MoveFeedListItem;
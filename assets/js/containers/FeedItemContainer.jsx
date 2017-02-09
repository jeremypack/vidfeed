import React from 'react';
import classNames from 'classnames';

import FeedListItem from '../components/FeedListItem';
import EditFeedTitleItem from '../components/EditFeedTitleItem';

const FeedItemContainer = React.createClass({

    propTypes: {
        feedId:                React.PropTypes.string.isRequired,
        isVimeo:               React.PropTypes.bool.isRequired,
        videoTitle:            React.PropTypes.string.isRequired,
        videoThumb:            React.PropTypes.string.isRequired,
        created:               React.PropTypes.string.isRequired
    },

    getInitialState:function() {
        return {
            feedTitle:this.props.videoTitle,
            editTitleMode:false,
            feedTitle:this.props.videoTitle,
            isValid:false,
            validationStarted:false
        };
    },

    componentWillUnmount:function() {
        clearInterval(this.validateInterval);
    },

    _setEditMode: function(e) {
        e.preventDefault();
        this.setState({
            editTitleMode:true
        });
    },

    _handleTitleChange: function (e) {
        this.setState({
            feedTitle: e.target.value
        });
        var validateTrigger = function() {
            if(this.state.feedTitle) {
                this.setState({
                    isValid:true
                });
            } else {
                this.setState({
                    isValid:false
                });
            }
        }.bind(this);
        if (!this.state.validationStarted) {
            this.setState({
                validationStarted: true
            });
            this.validateInterval = setInterval(validateTrigger,500);
        }
    },

    _cancelEdit: function(e){
        e.preventDefault();
        this.setState({
            editTitleMode: false,
            feedTitle: this.props.videoTitle
        });
        clearInterval(this.validateInterval);
    },

    _saveEdit: function (e) {
        e.preventDefault();
        var body = this.state.feedTitle.trim();
        if (!body) {
            return;
        }
        //var commentId = $(e.currentTarget).closest('.c-comment').data('id');
        //this.props.handleCommentEdit(commentId, this.props.author, body);
        this.setState({
            editTitleMode: false,
            feedTitle: body
        });
        clearInterval(this.validateInterval);
    },

    _setMoveMode:function(){

    },

    _deleteFeed:function(){

    },

    render: function() {

        var imgCropClasses = classNames({
            'imgCrop': true,
            'imgCrop--letterbox':this.props.isVimeo
        });

        var feedRouterLink = '/app/feed/'+this.props.feedId;

        if (this.state.editTitleMode) {
            return (
                <div className="o-layout__item u-1/2@tablet u-1/3@desktop">
                    <EditFeedTitleItem 
                        imgClasses={imgCropClasses}
                        videoThumb={this.props.videoThumb}
                        feedTitle={this.state.feedTitle}
                        created={this.props.created}
                        handleChange={this._handleTitleChange}
                        isValid={this.state.isValid}
                        saveEdit={this._saveEdit} 
                        cancelEdit={this._cancelEdit} />
                </div>
            );
        }

        return (
            <div className="o-layout__item u-1/2@tablet u-1/3@desktop">
                <FeedListItem 
                    route={feedRouterLink}
                    imgClasses={imgCropClasses}
                    videoThumb={this.props.videoThumb}
                    feedTitle={this.state.feedTitle}
                    created={this.props.created}
                    moveToProject={this._setMoveMode}
                    editFeedTitle={this._setEditMode}
                    deleteFeed={this._deleteFeed} />
            </div>
        );
    }

});

module.exports = FeedItemContainer;
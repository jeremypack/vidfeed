import React from 'react';
import Modal from 'react-modal';
import classNames from 'classnames';

import FeedListItem from '../components/FeedListItem';
import MoveFeedListItem from '../components/MoveFeedListItem';
import EditFeedTitleItem from '../components/EditFeedTitleItem';
import ModalChoice from '../components/ModalChoice';

const modalStyles = {
    overlay : {
        backgroundColor       : 'transparant'
    },
        content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        padding               : '0',
        border                : '0',
        borderRadius          : '0',
        transform             : 'translate(-50%, -50%)',
        transition            : 'opacity .4s ease-in-out',
        opacity               : '0',
        boxShadow             : '0px 0px 4px -1px rgba(0,0,0,.25)'
    }
};

const FeedItemContainer = React.createClass({

    propTypes: {
        feedId:                React.PropTypes.string,
        isVimeo:               React.PropTypes.bool,
        videoTitle:            React.PropTypes.string.isRequired,
        videoThumb:            React.PropTypes.string.isRequired,
        created:               React.PropTypes.string,
        modalOpen:             React.PropTypes.func,
        modalClose:            React.PropTypes.func,
        moveMode:              React.PropTypes.bool,
        setMoveMode:           React.PropTypes.func,
        firstFeedSelected:     React.PropTypes.string,
        collaboratorCount:     React.PropTypes.number,
        commentCount:          React.PropTypes.number,
        deleteFromProjectBool: React.PropTypes.bool
    },

    getInitialState:function() {
        return {
            editTitleMode:false,
            feedTitle:'',
            noThumb:false,
            noTitle:false,
            isValid:false,
            validationStarted:false,
            deleteFeedCheck:false,
            feedIdToDelete:undefined,
            moveMode:this.props.moveMode,
            selectedForMove:false,
            feedHover:false
        };
    },

    componentWillMount:function(){
        if (!this.props.videoThumb) {
            this.setState({
                noThumb:true
            });
        }
        if (!this.props.videoTitle) {
            this.setState({
                noTitle:true,
                feedTitle:'(Untitled feed)'
            });
        } else {
            this.setState({
                feedTitle:this.props.videoTitle,
            });
        }
    },

    componentWillUnmount:function() {
        clearInterval(this.validateInterval);
    },

    componentWillReceiveProps:function(nextProps){
        if (nextProps.moveMode != this.props.moveMode) {
            this.setState({
                moveMode:nextProps.moveMode
            });
        }
        if (nextProps.moveMode === false && this.state.selectedForMove) {
            this.setState({
                selectedForMove:false,
            });
        }
        if (this.props.feedId === nextProps.firstFeedSelected && !this.state.selectedForMove && this.state.moveMode) {
            this.setState({
                selectedForMove:true
            }, function(){
                this.props.selectedItem(true, this.props.feedId);
            });
        } 
        
    },

    _setEditMode: function(e) {
        e.preventDefault();
        this.setState({
            editTitleMode:true
        });
        if (this.state.noTitle) {
            this.setState({
                feedTitle:''
            });
        }
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
        if (!this.props.videoTitle) {
            this.setState({
                noTitle:true,
                feedTitle:'(Untitled feed)'
            });
        }
        clearInterval(this.validateInterval);
    },

    _saveEdit: function (e) {
        e.preventDefault();
        var body = this.state.feedTitle.trim();
        if (!body) {
            return;
        }
        $.ajax({
            type: 'put',
            url: '/api/feeds/' + this.props.feedId + '/set-title/',
            data: {
                title: body
            },
            success: function (data) {
                this.setState({
                    editTitleMode: false,
                    feedTitle: body,
                    noTitle: false
                });
                clearInterval(this.validateInterval);
            }.bind(this),
            error: function (data) {
                console.log(data);
            }
        });
    },

    _setMoveMode:function(e){
        e.preventDefault();
        this.props.setMoveMode(true, this.props.feedId);
    },

    _deleteFeed:function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.deleteFeedCheck) {
            this.props.handleDeleteFeed(this.state.feedIdToDelete, this.props.modalClose());
            this.setState({
                deleteFeedCheck: false,
                feedIdToDelete:undefined
            });
        } else { 
            this.setState({
                deleteFeedCheck: true,
                feedIdToDelete:this.props.feedId
            }, function(){
                this.props.modalOpen();
            });
        }
    },

    _deleteFeedFromProject:function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.deleteFeedCheck) {
            this.props.handleDeleteFeedFromProject(this.state.feedIdToDelete, this.props.modalClose());
            this.setState({
                deleteFeedCheck: false,
                feedIdToDelete:undefined
            });
        } else { 
            this.setState({
                deleteFeedCheck: true,
                feedIdToDelete:this.props.feedId
            }, function(){
                this.props.modalOpen();
            });
        }
    },

    _deleteFeedCancel: function(e) {
        e.preventDefault();
        this.props.modalClose();
        this.setState({
            deleteFeedCheck:false,
            feedIdToDelete:undefined
        });
    },

    _handleMoveSelect: function(e){
        e.preventDefault();
        this.setState({
            selectedForMove:!this.state.selectedForMove
        }, function(){
            this.props.selectedItem(this.state.selectedForMove, this.props.feedId);
        });
    },

    _feedHoverEnter:function(){
        this.setState({
            feedHover:true
        });
    },

     _feedHoverLeave:function(){
        this.setState({
            feedHover:false
        });
    },

    render: function() {

        var imgCropClasses = classNames({
            'imgCrop': true,
            'imgCrop--letterbox':this.props.isVimeo,
            'img--broken':this.state.noThumb
        });

        var feedRouterLink = '/app/feed/'+this.props.feedId;

        if (this.props.deleteFromProjectBool) {
            var deleteFeedModal = <Modal
                                    isOpen={this.state.deleteFeedCheck}
                                    onRequestClose={this._deleteFeedCancel}
                                    style={modalStyles}> 
                                    <ModalChoice
                                        closeModal={this._deleteFeedCancel}
                                        yesAction={this._deleteFeed}
                                        noAction={this._deleteFeedCancel}
                                        thirdAction={this._deleteFeedFromProject}
                                        heading='Remove feed'
                                        text='Are you sure?'
                                        yesText='Delete feed'
                                        noText='I&apos;ve changed my mind'
                                        thirdText='Remove feed from project' />
                                 </Modal>
        } else {
            var deleteFeedModal = <Modal
                                    isOpen={this.state.deleteFeedCheck}
                                    onRequestClose={this._deleteFeedCancel}
                                    style={modalStyles}> 
                                    <ModalChoice
                                        closeModal={this._deleteFeedCancel}
                                        yesAction={this._deleteFeed}
                                        noAction={this._deleteFeedCancel}
                                        heading='Remove feed'
                                        text='Are you sure?'
                                        yesText='Delete feed'
                                        noText='I&apos;ve changed my mind' />
                                 </Modal>
        }

        if (this.state.editTitleMode) {
            return (
                <div className="o-layout__item u-1/2@tablet u-1/3@desktop u-1/4@wide">
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

        if (this.state.moveMode) {
            return (
                <div className="o-layout__item u-1/2@tablet u-1/3@desktop u-1/4@wide">
                    <MoveFeedListItem 
                        imgClasses={imgCropClasses}
                        videoThumb={this.props.videoThumb}
                        feedTitle={this.state.feedTitle}
                        selected={this.state.selectedForMove}
                        handleClick={this._handleMoveSelect}
                        handleFeedHoverEnter={this._feedHoverEnter}
                        handleFeedHoverLeave={this._feedHoverLeave} 
                        feedHover={this.state.feedHover}
                        noTitle={this.state.noTitle} />
                </div>
            );
        }

        return (
            <div className="o-layout__item u-1/2@tablet u-1/3@desktop u-1/4@wide">
                <FeedListItem 
                    route={feedRouterLink}
                    imgClasses={imgCropClasses}
                    videoThumb={this.props.videoThumb}
                    feedTitle={this.state.feedTitle}
                    created={this.props.created}
                    moveToProject={this._setMoveMode}
                    editFeedTitle={this._setEditMode}
                    deleteFeed={this._deleteFeed}
                    collaboratorCount={this.props.collaboratorCount}
                    commentCount={this.props.commentCount}
                    noTitle={this.state.noTitle} />
                {deleteFeedModal}
            </div>
        );
    }

});

module.exports = FeedItemContainer;
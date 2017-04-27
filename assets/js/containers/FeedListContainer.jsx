import React from 'react';

import FeedItemContainer from '../containers/FeedItemContainer';

const FeedListContainer = React.createClass({

    getInitialState: function() {
        return {
            feeds:[],
            moveMode:false,
            firstFeedSelected:undefined,
            selectedCount:0
        };
    },

    componentDidMount: function() {
        this.setState({
            feeds:this.props.feeds
        })
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.cancelMove != this.state.moveMode) {
            this.setState({
                moveMode:nextProps.cancelMove,
                selectedCount:0
            });
        }
        if (nextProps.feeds != this.props.feeds) {
            this.setState({
                feeds:nextProps.feeds
            })
        }
        if (nextProps.showFeeds != this.props.showFeeds) {
            this.setState({
                feeds:nextProps.feeds
            })
        }
    },

    _deleteFeed:function(feedId, callback) {
        $.ajax({
            type: 'delete',
            url: '/api/feeds/' + feedId,
            success: function (data) {
                // var filteredFeeds = this.state.feeds.filter(function(feed) { 
                //     return feed.feed_id != feedId 
                // });
                // this.setState({
                //     feeds: filteredFeeds
                // });
                this.props.loadFeeds();
                callback;
            }.bind(this),
            error: function (data) {
                console.log(data);
            }
        });
    },

    _deleteFeedFromProject:function(feedId, callback) {
        $.ajax({
            type: 'delete',
            url: '/api/projects/' + this.props.projectId + '/feed/' + feedId,
            success: function (data) {
                // var filteredFeeds = this.state.feeds.filter(function(feed) { 
                //     return feed.feed_id != feedId 
                // });
                // this.setState({
                //     feeds: filteredFeeds
                // });
                this.props.loadFeeds();
                callback;
            }.bind(this),
            error: function (data) {
                console.log(data);
            }
        });
    },

    _toggleMoveMode:function(bool, feedId){
        this.setState({
            moveMode:bool,
            firstFeedSelected:feedId
        }, function(){
            this.props.toggleMoveMode(this.state.moveMode);
        });
    },

    _selectedItem:function(bool, feedId) {
        this.setState({
            firstFeedSelected:undefined
        });
        if (bool) {
            this.setState({
                selectedCount:this.state.selectedCount+1
            }, function(){
                this.props.addFeedForMove(feedId);
                this.props.selectedCount(this.state.selectedCount);
            });
        } else {
            this.setState({
                selectedCount:this.state.selectedCount-1
            }, function(){
                this.props.removeFeedFromMove(feedId);
                this.props.selectedCount(this.state.selectedCount);
            });
        }
    },

    _backToDashboard:function(){
        this.props.backToDashboard(0)
    },

    render: function() {

        var noFeeds =   <div className="o-layout__item c-feedList c-feedList__no-feeds">
                            <div className="content">
                                <h3 className="title">No feeds added yet <span className="nowrap">:(</span></h3>
                            </div>
                        </div>;
        
        let feedNodes;

        if (!this.props.vimeoModeBool && !this.props.youtubeModeBool) {
            feedNodes = this.state.feeds.map(function(feed, i) {
                if (this.props.projectId === 0) {
                    var deleteFromProject = false;
                } else {
                    var deleteFromProject = true;
                }
                return (
                    <FeedItemContainer
                        key={i}
                        created={feed.created}
                        feedId={feed.feed_id}
                        videoTitle={feed.video_title} 
                        videoThumb={feed.video_thumbnail}
                        modalOpen={this.props.modalOpen}
                        modalClose={this.props.modalClose}
                        moveMode={this.state.moveMode}
                        setMoveMode={this._toggleMoveMode}
                        firstFeedSelected={this.state.firstFeedSelected}
                        selectedItem={this._selectedItem}
                        handleDeleteFeed={this._deleteFeed}
                        handleDeleteFeedFromProject={this._deleteFeedFromProject}
                        collaboratorCount={feed.collaborator_count}
                        commentCount={feed.comment_count}
                        deleteFromProjectBool={deleteFromProject} />
                );
            }.bind(this));
        }

        if (this.props.vimeoModeBool) {
            feedNodes = this.state.feeds.map(function(feed, i) {
                return (
                    <FeedItemContainer
                        key={i}
                        feedId={feed.uri}
                        videoTitle={feed.name} 
                        videoThumb={feed.pictures.sizes[3].link}
                        selectedItem={this._selectedItem}
                        moveMode={true} />
                );
            }.bind(this));
        }

        if (this.props.youtubeModeBool) {
            feedNodes = this.state.feeds.map(function(feed, i) {
                return (
                    <FeedItemContainer
                        key={i}
                        feedId={feed.video_id}
                        videoTitle={feed.title} 
                        videoThumb={feed.thumbnails.standard.url}
                        selectedItem={this._selectedItem}
                        moveMode={true} />
                );
            }.bind(this));
        }

        if (this.props.showFeeds) {
            return (
                <section className={ feedNodes.length ? "o-layout c-feedList" : "o-layout__item c-feedList" }>
                    {feedNodes.length ? feedNodes : noFeeds }
                </section>
            );
        }

        if (this.props.importErrorVimeo && this.props.importErrorType === 401) {
            return (
                <div className="o-layout__item c-feedList c-feedList__no-feeds">
                    <h1>¯\_(ツ)_/¯</h1>
                    <p className="u-margin-bottom">There was problem accessing your Vimeo account.</p>
                    <ul className="o-list-inline">
                        <li className="o-list-inline__item">
                            <a href="/auth/vimeo" className="o-btn o-btn--primary o-btn--iconLeft u-margin-right"><i className="icon icon--plusCircle"></i>Re-connect to Vimeo</a>
                        </li>
                        <li className="o-list-inline__item">
                            <div onClick={this._backToDashboard} className="o-btn o-btn--secondary o-btn--ghost">Back to dashboard</div>
                        </li>
                    </ul>
                </div>
            );
        }

        if (this.props.importErrorYoutube && this.props.importErrorType === 401) {
            return (
                <div className="o-layout__item c-feedList c-feedList__no-feeds">
                    <h1>¯\_(ツ)_/¯</h1>
                    <p className="u-margin-bottom">There was problem accessing your Youtube account.</p>
                    <ul className="o-list-inline">
                        <li className="o-list-inline__item">
                            <a href="/auth/youtube" className="o-btn o-btn--primary o-btn--iconLeft u-margin-right"><i className="icon icon--plusCircle"></i>Re-connect Youtube</a>
                        </li>
                        <li className="o-list-inline__item">
                            <div onClick={this._backToDashboard} className="o-btn o-btn--secondary o-btn--ghost">Back to dashboard</div>
                        </li>
                    </ul>
                </div>
            );
        }

        return (
            <div className="o-layout__item c-feedList c-feedList__no-feeds">
                <div className="content">
                    <h3 className="title">loading…</h3>
                </div>
            </div>
        );
        
    }

});

module.exports = FeedListContainer;
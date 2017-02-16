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
        this._loadFeedsFromServer();    
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.cancelMove != this.state.moveMode) {
            this.setState({
                moveMode:nextProps.cancelMove,
                selectedCount:0
            });
        }
    },

    _loadFeedsFromServer: function() {
        $.ajax({
            url: '/api/feeds/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                for (var i = data.length-1; i >= 0; i--) {
                    if (!data[i].owner) {
                        data.splice(i, 1);
                    }
                    if (data[i].owner.email != window.vidfeed.user.email) {
                        data.splice(i, 1);
                    }
                }
                data.sort(function(a,b){
                    return new Date(b.created) - new Date(a.created);
                });
                this.setState({
                    feeds: data
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    },

    _toggleMoveMode:function(bool, feedId){
        this.setState({
            moveMode:bool,
            firstFeedSelected:feedId
        }, function(){
            this.props.moveMode(this.state.moveMode);
        });
    },

    _selectedCount:function(bool) {
        this.setState({
            firstFeedSelected:undefined
        });
        if (bool) {
            this.setState({
                selectedCount:this.state.selectedCount+1
            }, function(){
                this.props.selectedCount(this.state.selectedCount);
            });
        } else {
            this.setState({
                selectedCount:this.state.selectedCount-1
            }, function(){
                this.props.selectedCount(this.state.selectedCount);
            });
        }
    },

    render: function() {

        var feedNodes = this.state.feeds.map(function(feed, i) {
            if (feed.provider.name === 'vimeo') {
                var isVimeo = true;
            } else {
                var isVimeo = false;
            }
            return (
                <FeedItemContainer
                    key={i}
                    created={feed.created}
                    feedId={feed.feed_id}
                    isVimeo={isVimeo}
                    videoTitle={feed.video_title} 
                    videoThumb={feed.video_thumbnail}
                    modalOpen={this.props.modalOpen}
                    modalClose={this.props.modalClose}
                    moveMode={this.state.moveMode}
                    setMoveMode={this._toggleMoveMode}
                    firstFeedSelected={this.state.firstFeedSelected}
                    selectedCount={this._selectedCount} />
            );
        }.bind(this));

        return (
            <section className="o-layout">
                {feedNodes}
            </section>
        );
    }

});

module.exports = FeedListContainer;
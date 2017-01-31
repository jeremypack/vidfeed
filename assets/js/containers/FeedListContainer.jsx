import React from 'react';
import Equalizer from 'react-equalizer';

import ProjectTitleContainer from '../containers/ProjectTitleContainer';
import CreateFeedContainer from '../containers/CreateFeedContainer';
import FeedListItem from '../components/FeedListItem';

const FeedListContainer = React.createClass({

    getInitialState: function() {
        return {
            feeds:[],
            tallestInfo:undefined
        };
    },

    componentDidMount: function() {
        this._loadFeedsFromServer();    
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

    render: function() {
        
        var FeedListStyle = {
            height:this.props.windowHeight,
            overflowY:'scroll'
        }

        var feedNodes = this.state.feeds.map(function(feed, i) {
            if (feed.provider.name === 'vimeo') {
                var isVimeo = true;
            } else {
                var isVimeo = false;
            }
            return (
                <FeedListItem
                    key={i}
                    created={feed.created}
                    feedId={feed.feed_id}
                    isVimeo={isVimeo}
                    videoTitle={feed.video_title} 
                    videoThumb={feed.video_thumbnail} />
            );
        }.bind(this));

        return (
            <section style={FeedListStyle} className="c-feedList">
                <ProjectTitleContainer />
                <div className="o-layout u-margin-bottom">
                    <div className="o-layout__item u-1/2@desktop">
                        <CreateFeedContainer projectId={12} />
                    </div>
                    <div className="o-layout__item u-1/2@desktop">
                        <a href="#" className="o-btn o-btn--primary o-btn--iconLeft u-margin-right"><i className="icon icon--plusCircle"></i>Vimeo</a>
                        <a href="#" className="o-btn o-btn--primary o-btn--iconLeft"><i className="icon icon--plusCircle"></i>Youtube</a>
                    </div>
                </div>
                
                <div className="o-layout">
                    {feedNodes}
                </div>
            </section>
        );
    }

});

module.exports = FeedListContainer;
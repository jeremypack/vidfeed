import React from 'react';
import classNames from 'classnames';

import HeaderContainer from '../containers/HeaderContainer';
import CollaboratorsContainer from '../containers/CollaboratorsContainer';
import ShareFeedContainer from '../containers/ShareFeedContainer';
import OwnFeedContainer from '../containers/OwnFeedContainer';
import FeedVideoContainer from '../containers/FeedVideoContainer';
import CommentFormContainer from '../containers/CommentFormContainer';
import CommentsListContainer from '../containers/CommentsListContainer';

function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
}

const Feed = React.createClass({

    getInitialState: function() {
        return {
            feed:[],
            owner:undefined,
            ajaxDone:false,
            timecode:0,
            timecodeSeconds:0,
            blur:false,
            shareModal:false,
            commentsOpen:false,
            drawerVisible:false,
            commentsBtn:true,
            windowHeight:undefined,
            videoColWidth:undefined,
            notResized:true,
            timecodeClicked:undefined
        };
    },

    componentDidMount: function() {
        $.ajax({
            url: "/api/feeds/" + this.props.params.feedId,
            dataType: 'json',
            context: this,
            success: function(data) {
                this.setState({
                    feed: data,
                    owner: data.owner,
                    ajaxDone: true
                });
            }
        });
        this._resizeContent();
        window.addEventListener('resize', this._resizeContent);
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this._resizeContent);
    },

    _resizeContent : function() {
        var windowWidth = window.innerWidth;
        this.setState({
            videoColWidth:undefined,
            notResized:true
        });
        if (windowWidth < 740) {
            this.setState({
                windowHeight:undefined
            });
            return;
        }
        var headerHeight = this.refs.header.clientHeight + this.refs.infoBar.clientHeight;
        var remainingHeight = window.innerHeight - headerHeight;
        this.setState({
            windowHeight:remainingHeight
        }, function() {
            if (windowWidth > 1040 && this.state.windowHeight < 690 || this.refs.main.clientHeight > this.state.windowHeight) {
                var videoColWidth = this.refs.main.clientWidth;
                var ratio = videoColWidth/this.refs.main.clientHeight;
                var requiredWidth = this.state.windowHeight*ratio;
                var reducedWidth = Math.floor(requiredWidth);
                this.setState({
                    videoColWidth:reducedWidth-25,
                    notResized:false
                });
            }   
        });
    },

    _getTimecode: function(timecode) {
        if (timecode != this.state.timecode) {
            var timecodeInSeconds = hmsToSecondsOnly(timecode);
            this.setState({
                timecode: timecode,
                timecodeSeconds: timecodeInSeconds
            });
        }
        
    },

    _setOwner: function(owner) {
        this.setState({
            owner:owner
        });
    },

    _shareModalOpen: function(e) {
        e.preventDefault();
        this.setState({
            shareModal:true
        });
        this._modalOpen();
    },

    _modalOpen: function(e) {
        this.setState({
            blur:true
        });
    },

    _modalClose: function() {
        this.setState({
            shareModal:false,
            blur:false
        });
    },

    _commentsToggle: function(e, pos) {
        if (e) {
            e.preventDefault();
        }
        
        if (!this.state.commentsOpen || pos==='open') {
            this.setState({
                commentsOpen:true,
                commentsBtn:false
            });
            setTimeout(function() {
                this.setState({
                    drawerVisible:true
                });
            }.bind(this), 150);
           
        } else {
            this.setState({
                drawerVisible:false
            });
            setTimeout(function() {
                this.setState({
                    commentsOpen:false
                });
            }.bind(this), 150);
            setTimeout(function() {
                this.setState({
                    commentsBtn:true
                });
            }.bind(this), 450);
        }
    },

    _timecodeClick: function(timecodeClicked) {
        this.setState({
            timecodeClicked:timecodeClicked
        });
    },

    render: function() {

        if (this.state.ajaxDone && !this.state.owner && !this.state.shareModal) {
            var ownFeed =   <OwnFeedContainer
                                modalOpen={this._modalOpen}
                                modalClose={this._modalClose}
                                setOwner={this._setOwner}
                                feedId={this.props.params.feedId}
                                wait={3000} />
        }

        if (this.state.shareModal) {
            var shareFeed = <ShareFeedContainer
                                modalOpen={this.state.shareModal}
                                modalClose={this._modalClose}
                                feedId={this.props.params.feedId} />
        } else {
            var shareFeed = undefined;
        }        

        if (this.state.blur) {
            var blurClasses = 'blurLayer blurLayer--active';
        } else {
            var blurClasses = 'blurLayer';
        }

        var drawerClasses = classNames({
            'o-offCanvas__drawer--tablet o-layout__item':true,
            'o-offCanvas__drawer--tablet--open':this.state.drawerVisible,
            'u-1/3@tablet u-1/4@desktop':this.state.commentsOpen
        });

        var commentsBtnClasses = classNames({
            'o-offCanvas__open o-btn o-btn--secondary o-btn--small o-btn--icon': true,
            'u-opacity-0':!this.state.commentsBtn
        });

        var offCanvasStyle = {
            height:this.state.windowHeight,
            overflow:'hidden'
        };

        var videoColWidthClasses = classNames({
            'o-offCanvas__main o-layout__item': true,
            'u-2/3@tablet u-3/5@desktop':this.state.notResized
        });

        var videoColWidthStyle = {
            width:this.state.videoColWidth,
            transition:'all ease 300ms'
        };

        return (
            <div>
                <div className={blurClasses}>
                    
                    <div ref="header">
                        
                        <HeaderContainer 
                            plusAccountInterest={this._plusAccountSignUp} />
                    
                    </div>
                    
                    <section ref="infoBar" className="feedInfo u-clearfix">
                        <h1 className="lede float--left u-margin-bottom-none">{this.state.feed.video_title}</h1>
                        <div className="float--right">
                            
                            <CollaboratorsContainer
                                feedId={this.props.params.feedId}
                                modalOpen={this._modalOpen}
                                modalClose={this._modalClose}
                                pollInterval={1000} />
                            
                            <a href="#" onClick={this._shareModalOpen} className="o-btn o-btn--tertiary o-btn--iconRight o-btn--outline o-btn--small">Share <i className="icon icon--user"></i></a>
                        </div>
                    </section>
                    
                    <div style={offCanvasStyle} className="o-offCanvas__outer--tablet o-layout o-layout--flush o-layout--center ">
                        <a href="#" className={commentsBtnClasses} onClick={this._commentsToggle}><i className="icon icon--bubble"></i><span className="u-hidden-visually">open comments</span></a>
                        <div style={videoColWidthStyle} ref="main" className={videoColWidthClasses}> 
                            <div className="o-offCanvas__main__inner">
                                
                                <FeedVideoContainer
                                    feedId={this.props.params.feedId}
                                    onTimecodeChange={this._getTimecode}
                                    seekToTime={this.state.timecodeClicked} />

                                <CommentFormContainer
                                    modalOpen={this._modalOpen}
                                    modalClose={this._modalClose}
                                    commentSubmitted={this._commentsToggle}
                                    feedId={this.props.params.feedId}
                                    timecode={this.state.timecode}
                                    timecodeSeconds={this.state.timecodeSeconds} />

                            </div>   
                        </div>
                        
                        <div ref="drawer" className={drawerClasses}>
                            <div className="o-offCanvas__drawer__inner--tablet u-1/3@tablet u-1/4@desktop">
                                <a href="#" className="o-offCanvas__close" onClick={this._commentsToggle}><i className="icon icon--crossWhite"></i><span className="u-hidden-visually">Hide comments</span></a>
                                
                                <CommentsListContainer
                                    modalOpen={this._modalOpen}
                                    modalClose={this._modalClose}
                                    windowHeight={this.state.windowHeight}
                                    feedId={this.props.params.feedId}
                                    pollInterval={1000}
                                    timecode={this.state.timecodeSeconds}
                                    timecodeClick={this._timecodeClick} />

                            </div>
                            
                        </div>

                    </div>
                </div>
                {shareFeed}
                {ownFeed}
            </div>
        );
    }

});

module.exports = Feed;
import React from 'react';

import HeaderContainer from '../containers/HeaderContainer';
import ProjectsListContainer from '../containers/ProjectsListContainer';
import ProjectTitleContainer from '../containers/ProjectTitleContainer';
import CreateFeedContainer from '../containers/CreateFeedContainer';
import FeedListContainer from '../containers/FeedListContainer';

const Dashboard = React.createClass({

    getInitialState:function() {
        return {
            windowHeight:undefined,
            blur:false,
            moveProjects:false
        }
    },

    componentDidMount: function() {
        this._resizeContent();
        window.addEventListener('resize', this._resizeContent);
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this._resizeContent);
    },

    _resizeContent : function() {
        var windowWidth = window.innerWidth;
        if (windowWidth < 740) {
            this.setState({
                windowHeight:undefined
            });
            return;
        }
        var headerHeight = this.refs.header.clientHeight;
        var remainingHeight = window.innerHeight - headerHeight;
        this.setState({
            windowHeight:remainingHeight
        });
    },

    _modalOpen: function() {
        this.setState({
            blur:true
        });
    },

    _modalClose: function() {
        this.setState({
            blur:false
        });
    },

    render: function() {
        
        var ScrollPaneStyle = {
            height:this.state.windowHeight,
            overflowY:'scroll'
        }

        if (this.state.blur) {
            var blurClasses = 'blurLayer blurLayer--active';
        } else {
            var blurClasses = 'blurLayer';
        }

        if (this.state.vimeoMode) {
            var heading = 'Vimeo videos'
        }
        if (this.state.youtubeMode) {
            var heading = 'Youtube videos'
        }
        if (!this.state.vimeoMode || !this.state.youtubeMode) {
            var heading = <ProjectTitleContainer editable={!this.state.moveProjects} />;
        }

        return (
            <div className={blurClasses}>
                <div ref="header">
                    <HeaderContainer />
                </div>
                <div className="o-layout">
                    <div className="o-layout__item u-1/4@tablet u-1/5@desktop">
                        <ProjectsListContainer
                            windowHeight={this.state.windowHeight}
                            modalOpen={this._modalOpen}
                            modalClose={this._modalClose} />
                    </div>
                    <div className="o-layout__item u-3/4@tablet u-4/5@desktop">
                        <div style={ScrollPaneStyle} className="scrollPane">
                            <div className="scrollPane__content">
                                {heading}
                                <div className="o-layout u-margin-bottom">
                                    <div className="o-layout__item u-1/2@desktop">
                                        <CreateFeedContainer projectId={12} />
                                    </div>
                                    <div className="o-layout__item u-1/2@desktop">
                                        <a href="#" className="o-btn o-btn--primary o-btn--iconLeft u-margin-right"><i className="icon icon--plusCircle"></i>Vimeo</a>
                                        <a href="#" className="o-btn o-btn--primary o-btn--iconLeft"><i className="icon icon--plusCircle"></i>Youtube</a>
                                    </div>
                                </div>
                                <FeedListContainer />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Dashboard;
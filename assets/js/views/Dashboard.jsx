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
            moveProjects:false,
            vimeoMode:false,
            youtubeMode:false,
            selectedFeedCount:0,
            selectedProjectId:0,
            defaultProjectSelected:true,
            projects:[]
        }
    },

    componentDidMount: function() {
        this._loadProjectsFromServer();
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

    _loadProjectsFromServer:function(){
        $.ajax({
            type: 'get',
            url: '/api/projects/',
            success: function (data) {
                this.setState({
                    projects:data
                });
            }.bind(this),
            error: function (data) {
                console.log(data);
            }
        });
    },

    _addNewProject:function(title, callback){
        $.ajax({
            type: 'post',
            url: '/api/projects/',
            data: {
                title: title
            },
            success: function (data) {
                this.setState({
                    projects: this.state.projects.concat([data])
                });
                callback;
            }.bind(this),
            error: function (data) {
                console.log(data);
            }
        });
    },

    _deleteProject:function(projectId, callback) {
        if (!projectId) {
            return;
        }
        $.ajax({
            type: 'delete',
            url: '/api/projects/' + projectId,
            success: function (data) {
                var filteredProjects = this.state.projects.filter(function(project) { return project.id != projectId });
                this.setState({
                    projects:filteredProjects,
                    defaultProjectSelected:true,
                    selectedProjectId:0,
                });
                callback;
            }.bind(this),
            error: function (data) {
                console.log(data);
            }
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

    _moveProjectsModeToggle:function(bool) {    
        if (bool) {
            this.setState({
                moveProjects:bool
            });
        } else {
            this.setState({
                moveProjects:!this.state.moveProjects
            });
        }
    },

    _selectedFeedCount:function(count){
        this.setState({
            selectedFeedCount:count
        });
    },

    _cancelMove:function(e){
        e.preventDefault();
        this._moveProjectsModeToggle(false);
    },

    _selectProject:function(id) {
        this.setState({
            selectedProjectId:id,
            moveProjects:false,
            defaultProjectSelected:false
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
            var heading = <ProjectTitleContainer
                            editable={!this.state.moveProjects}
                            modalOpen={this._modalOpen}
                            modalClose={this._modalClose}
                            projects={this.state.projects}
                            projectId={this.state.selectedProjectId}
                            handleDeleteProject={this._deleteProject} />;
        }

        let button1, button2 = null;

        if (!this.state.moveProjects && !this.state.vimeoMode && !this.state.youtubeMode) {
            var createFeed = <CreateFeedContainer projectId={12} />
            button1 = <a href="#" className="o-btn o-btn--blue o-btn--iconLeft u-margin-right"><i className="icon icon--plusCircle"></i>Vimeo</a>;
            button2 = <a href="#" className="o-btn o-btn--primary o-btn--iconLeft"><i className="icon icon--plusCircle"></i>Youtube</a>;
        }

        if (this.state.moveProjects) {
            var selectedFeedCount = this.state.selectedFeedCount === 1 ? <h3 className="selectedCount">1 Video Selected</h3> : <h3 className="selectedCount">{this.state.selectedFeedCount} Videos Selected</h3>;
            button1 = <a href="#" className="o-btn o-btn--primary u-margin-right">Move to another project</a>;
            button2 = <a href="#" className="o-btn o-btn--secondary" onClick={this._cancelMove}>I don&apos;t want to move any videos</a>;
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
                            modalClose={this._modalClose}
                            projects={this.state.projects}
                            defaultProjectSelected={this.state.defaultProjectSelected}
                            selectedProject={this._selectProject}
                            newProject={this._addNewProject} />
                    </div>
                    <div className="o-layout__item u-3/4@tablet u-4/5@desktop">
                        <div style={ScrollPaneStyle} className="scrollPane">
                            <div className="scrollPane__content">
                                {heading}
                                <div className={this.state.moveProjects === true ? 'o-layout u-margin-bottom o-layout--auto o-layout--middle' : 'o-layout u-margin-bottom'}>
                                    <div className="o-layout__item u-1/2@desktop">
                                        {createFeed}
                                        {selectedFeedCount}
                                    </div>
                                    <div className="o-layout__item u-1/2@desktop">
                                        {button1}
                                        {button2}
                                    </div>
                                </div>
                                <FeedListContainer
                                    modalOpen={this._modalOpen}
                                    modalClose={this._modalClose}
                                    moveMode={this._moveProjectsModeToggle}
                                    selectedCount={this._selectedFeedCount}
                                    projectId={this.state.selectedProjectId}
                                    cancelMove={this.state.moveProjects} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Dashboard;
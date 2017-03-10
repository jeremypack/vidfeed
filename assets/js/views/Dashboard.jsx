import React from 'react';
import { browserHistory } from 'react-router';
import Modal from 'react-modal';

import HeaderContainer from '../containers/HeaderContainer';
import ProjectsListContainer from '../containers/ProjectsListContainer';
import ProjectTitleContainer from '../containers/ProjectTitleContainer';
import CreateFeedContainer from '../containers/CreateFeedContainer';
import FeedListContainer from '../containers/FeedListContainer';
import ModalProjectChoice from '../components/ModalProjectChoice';

function getIndex(value, arr, prop) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i][prop] === value) {
            return i;
        }
    }
    return -1; //to handle the case where the value doesn't exist
}

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

const Dashboard = React.createClass({

    getInitialState:function() {
        return {
            windowHeight:undefined,
            blur:false,
            moveProjects:false,
            vimeoMode:false,
            youtubeMode:false,
            selectedFeedCount:0,
            selectedProjectId:undefined,
            projects:[],
            feeds:[],
            showFeeds:false,
            feedsSelected:[],
            moveFeedModal:false
        }
    },

    componentWillMount:function(){
        if (!this.props.params.projectId) {
            this.setState({
                selectedProjectId:0
            })
        } else {
            this.setState({
                selectedProjectId:parseInt(this.props.params.projectId,10)
            })
        }
    },

    componentDidMount: function() {
        this._loadProjectsFromServer();
        this._loadFeedsFromServer(this.state.selectedProjectId);
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

    _updateProjectTitle:function(projectTitle, projectId, callback){
        $.ajax({
            type: 'put',
            url: '/api/projects/' + projectId,
            data: {
                title: projectTitle
            },
            success: function (data) {
                var index = getIndex(projectId, this.state.projects, 'id');
                const projects = this.state.projects;
                projects[index] = { id:projectId, title: projectTitle };
                this.setState({
                    projects:projects
                });
                callback;
            }.bind(this),
            error: function (data) {
                console.log(data);
            }
        });
    },

    _loadFeedsFromServer: function(projectId) {
        let feedPath;
        if (projectId != 0) {
            feedPath = '/api/projects/' + projectId + '/feeds';
        } else {
            feedPath = '/api/feeds/'
        }
        $.ajax({
            url: feedPath,
            success: function(data) {
                data.sort(function(a,b){
                    return new Date(b.created) - new Date(a.created);
                });
                this.setState({
                    feeds: data,
                    showFeeds: true
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
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
            defaultProjectSelected:false,
            showFeeds:false
        }, function(){
            this._loadFeedsFromServer(this.state.selectedProjectId);
            browserHistory.push('/app/dashboard/'+this.state.selectedProjectId);
        });
        
    },

    _addFeedForMove:function(feedId){
        this.setState({
            feedsSelected: this.state.feedsSelected.concat([feedId])
        });
    },

    _removeFeedFromMove:function(feedId){
        var index = getIndex(feedId, this.state.feedsSelected);
        const feeds = this.state.feedsSelected;
        feeds.splice(index, 1);
        this.setState({
            feedsSelected:feeds
        });
    },

    _moveToProject:function(e){
        e.preventDefault();
        if (!this.state.moveFeedModal) {
            this.setState({
                moveFeedModal:true,
                blur:true
            });
        } else {
            const projectId = parseInt(e.target.attributes.getNamedItem('data-project-id').value, 10);
            const feeds = this.state.feedsSelected
            for (var i = 0; i < feeds.length; i++) {
                $.ajax({
                    type: 'post',
                    url: '/api/projects/' + projectId + '/feed/' + feeds[i],
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            }
            this.setState({
                moveFeedModal:false,
                blur:false
            }, function(){
                this._selectProject(projectId);
            });
        }
    },

    _moveFeedCancel:function(e){
        e.preventDefault();
        this.setState({
            moveFeedModal:false,
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
            var heading = <ProjectTitleContainer
                            editable={!this.state.moveProjects}
                            modalOpen={this._modalOpen}
                            modalClose={this._modalClose}
                            projects={this.state.projects}
                            projectId={this.state.selectedProjectId}
                            handleDeleteProject={this._deleteProject}
                            updateProjectTitle={this._updateProjectTitle} />;
        }

        let button1, button2 = null;

        if (!this.state.moveProjects && !this.state.vimeoMode && !this.state.youtubeMode) {
            var createFeed = <CreateFeedContainer
                                projectId={this.state.selectedProjectId}
                                loadFeeds={this._loadFeedsFromServer} />
            button1 = <a href="#" className="o-btn o-btn--blue o-btn--iconLeft u-margin-right"><i className="icon icon--plusCircle"></i>Vimeo</a>;
            button2 = <a href="#" className="o-btn o-btn--primary o-btn--iconLeft"><i className="icon icon--plusCircle"></i>Youtube</a>;
        }

        if (this.state.moveProjects) {
            var selectedFeedCount = this.state.selectedFeedCount === 1 ? <h3 className="selectedCount">1 Video Selected</h3> : <h3 className="selectedCount">{this.state.selectedFeedCount} Videos Selected</h3>;
            button1 = <a href="#" className="o-btn o-btn--primary u-margin-right" onClick={this._moveToProject}>Move to another project</a>;
            button2 = <a href="#" className="o-btn o-btn--secondary" onClick={this._cancelMove}>I don&apos;t want to move any feeds</a>;
        }

        var moveFeedModal = <Modal
                                isOpen={this.state.moveFeedModal}
                                onRequestClose={this._moveFeedCancel}
                                style={modalStyles}> 
                                <ModalProjectChoice
                                    closeModal={this._moveFeedCancel}
                                    heading='Select Project'
                                    text='Which project wil you choose?'
                                    projects={this.state.projects}
                                    projectClick={this._moveToProject} />
                             </Modal>
        
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
                            selectProject={this._selectProject}
                            selectedProjectId={this.state.selectedProjectId}
                            newProject={this._addNewProject} />
                    </div>
                    <div className="o-layout__item u-3/4@tablet u-4/5@desktop">
                        <div style={ScrollPaneStyle} className="scrollPane">
                            <div className="scrollPane__content">
                                {heading}
                                <div className={this.state.moveProjects === true ? 'o-layout o-layout--auto o-layout--middle u-margin-bottom' : 'o-layout u-margin-bottom'}>
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
                                    feeds={this.state.feeds}
                                    showFeeds={this.state.showFeeds}
                                    modalOpen={this._modalOpen}
                                    modalClose={this._modalClose}
                                    moveMode={this._moveProjectsModeToggle}
                                    selectedCount={this._selectedFeedCount}
                                    projectId={this.state.selectedProjectId}
                                    cancelMove={this.state.moveProjects}
                                    addFeedForMove={this._addFeedForMove}
                                    removeFeedFromMove={this._removeFeedFromMove} />
                            </div>
                        </div>
                    </div>
                </div>
                {moveFeedModal}
            </div>
        );
    }

});

module.exports = Dashboard;
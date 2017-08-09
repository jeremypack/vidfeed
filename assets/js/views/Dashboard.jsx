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
            moveFeedModal:false,
            feedsOwnedCount:0,
            newFeedsCreated:[],
            importErrorVimeo:false,
            importErrorYoutube:false,
            importErrorType:undefined // 400 = unknown (400 error), 401 = Unauthorised application (401 error)
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
        if (!projectId) {
            projectId = this.state.selectedProjectId
        }
        this.setState({
            feeds:[],
            showFeeds:false
        })
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

    _setDefaultState:function(e){
        if (e) {
            e.preventDefault();
        }
        this.setState({
            showFeeds:false,
            vimeoMode:false,
            youtubeMode:false,
            moveProjects:false,
            moveFeedModal:false,
            blur:false,
            feedsSelected:[],
            feeds:[],
            feedsOwnedCount:0,
            selectedFeedCount:0,
            importErrorVimeo:false,
            importErrorYoutube:false,
            importErrorType:undefined
        }, function(){
            this._loadFeedsFromServer(this.state.selectedProjectId);
        });
    },

    _selectProject:function(id) {
        this.setState({
            selectedProjectId:id,
            defaultProjectSelected:false,
        }, function(){
            this._setDefaultState();
            browserHistory.push('/app/dashboard/'+id);
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
            var projectId = parseInt(e.target.attributes.getNamedItem('data-project-id').value, 10);
            const feeds = this.state.feedsSelected
            for (var i = 0; i < feeds.length; i++) {
                $.ajax({
                    type: 'post',
                    url: '/api/projects/' + projectId + '/feed/' + feeds[i],
                    success: function (data) {
                        //console.log(data);
                    },
                    error: function (data) {
                        //console.log(data);
                    }
                });
            }
            this.setState({
                moveFeedModal:false,
                blur:false,
                moveProjects:false,
                feedsSelected:[]
            }, function(){
                this._loadFeedsFromServer(this.state.selectedProjectId);
            });
        }
    },

    _addVideosAsFeeds:function(e){
        e.preventDefault();
        const feeds = this.state.feedsSelected;
        for (var i = 0; i < feeds.length; i++) {
            if (this.state.vimeoMode) {
                var feedUrlClean1 = feeds[i].split('/videos')[1];
                var feedUrlClean2 = feedUrlClean1.split(':')[0];
                var videoUrl = 'http://vimeo.com'+feedUrlClean2;
            }
            if (this.state.youtubeMode) {
                var videoUrl = 'http://youtube.com/watch?v='+feeds[i];
            }
            // create feeds
            $.ajax({
                type: "POST",
                context: this,
                url: "/api/feeds/",
                data: {
                    videoUrl: videoUrl
                },
                success: function (ev){
                    this._setFeedOwner(ev.feed_id);
                    this.setState({
                        newFeedsCreated: this.state.newFeedsCreated.concat([ev.feed_id])
                    });
                }.bind(this),
                error: function (ev) {
                    this.setState({
                        error: JSON.parse(ev.responseText).message
                    });
                }
            });
        }
    },

    _setFeedOwner:function(feedId) {
        $.ajax({
            type: "POST",
            context: this,
            url: "/api/feeds/" + feedId + '/set-owner/',
            data: {
                owner: window.vidfeed.user.email
            },
            success: function (ev){
                this.setState({
                    feedsOwnedCount:this.state.feedsOwnedCount+1
                }, function(){
                    if (this.state.feedsOwnedCount === this.state.feedsSelected.length) {
                        if (this.state.selectedProjectId != 0) {
                            this._addNewFeedsToProject();
                        } else {
                            this._setDefaultState();
                        }
                    }
                });
            }.bind(this),
            error: function (ev) {
                console.log(window.vidfeed.user.email,'owner');
                console.log(this.state.newFeedId,'feedId');
            }
        });
    },

    _addNewFeedsToProject:function(){
        const feeds = this.state.newFeedsCreated
        for (var i = 0; i < feeds.length; i++) {
            $.ajax({
                type: 'post',
                url: '/api/projects/' + this.state.selectedProjectId + '/feed/' + feeds[i],
                success: function (data) {
                    this._setDefaultState();
                }.bind(this),
                error: function (data) {
                    console.log(data, 'add new error');
                }
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

    _activateVimeoMode:function(){
        this.setState({
            feeds:[],
            showFeeds:false,
            vimeoMode:true,
            moveProjects:true
        })
        $.ajax({
            type: 'get',
            url: '/api/vimeo/videos',
            success: function (data) {
                this.setState({
                    feeds:data,
                    showFeeds:true
                })
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                this.setState({
                    importErrorVimeo:true,
                    importErrorType:xhr.status,
                    selectedProjectId:undefined
                });
                window.vidfeed.user.subscription.linked_vimeo = false;
            }.bind(this)
        })
    },

    _activateYoutubeMode:function(){
        this.setState({
            feeds:[],
            showFeeds:false,
            youtubeMode:true,
            moveProjects:true
        })
        $.ajax({
            type: 'get',
            url: '/api/youtube/videos',
            success: function (data) {
                this.setState({
                    feeds:data,
                    showFeeds:true
                })
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                this.setState({
                    importErrorYoutube:true,
                    importErrorType:xhr.status,
                    selectedProjectId:undefined
                });
                window.vidfeed.user.subscription.linked_youtube = false;
            }.bind(this)
        })
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

        if (!this.state.vimeoMode && !this.state.youtubeMode) {
            var heading = <ProjectTitleContainer
                            editable={!this.state.moveProjects}
                            modalOpen={this._modalOpen}
                            modalClose={this._modalClose}
                            projects={this.state.projects}
                            projectId={this.state.selectedProjectId}
                            handleDeleteProject={this._deleteProject}
                            updateProjectTitle={this._updateProjectTitle} />;
        }

        if (this.state.vimeoMode && this.state.feeds.length) {
            var heading = <div className="c-projectTitle">
                            <h1 className="c-projectTitle__title">Vimeo videos</h1>
                        </div>
        }
        if (this.state.youtubeMode && this.state.feeds.length) {
            var heading = <div className="c-projectTitle">
                            <h1 className="c-projectTitle__title">Youtube videos</h1>
                        </div>
        }

        let button1, button2 = null;

        if (!this.state.moveProjects && !this.state.vimeoMode && !this.state.youtubeMode) {
            
            var createFeed = <CreateFeedContainer
                                projectId={this.state.selectedProjectId}
                                loadFeeds={this._loadFeedsFromServer} />

            if (window.vidfeed.user.subscription.linked_vimeo) {
            
                button1 = <div onClick={this._activateVimeoMode} className="o-btn o-btn--blue o-btn--iconLeft u-margin-right"><i className="icon icon--plusCircle"></i>Import from Vimeo</div>;
            
            } else {
            
                button1 = <a href="/auth/vimeo" className="o-btn o-btn--blue o-btn--iconLeft u-margin-right"><i className="icon icon--plusCircle"></i>Vimeo</a>;
            
            }
            
            if (window.vidfeed.user.subscription.linked_youtube) {
            
                button2 = <div onClick={this._activateYoutubeMode} className="o-btn o-btn--primary o-btn--iconLeft"><i className="icon icon--plusCircle"></i>Import from Youtube</div>;
            
            } else {
            
                button2 = <a href="/auth/youtube" className="o-btn o-btn--primary o-btn--iconLeft"><i className="icon icon--plusCircle"></i>Youtube</a>;
            
            }
            
        }

        if (this.state.feeds.length) {
            
            if (this.state.moveProjects || this.state.vimeoMode || this.state.youtubeMode) {
                var selectedFeedCount = this.state.selectedFeedCount === 1 ? <h3 className="selectedCount">1 Video Selected</h3> : <h3 className="selectedCount">{this.state.selectedFeedCount} Videos Selected</h3>;
            }

            if (this.state.moveProjects) {
                button1 = <a href="#" className="o-btn o-btn--primary u-margin-right" onClick={this._moveToProject}>Move to another project</a>;
                button2 = <a href="#" className="o-btn o-btn--secondary" onClick={this._setDefaultState}>I don&apos;t want to move any feeds</a>;
            }

            if (this.state.vimeoMode || this.state.youtubeMode) {
                button1 = <a href="#" className="o-btn o-btn--primary u-margin-right" onClick={this._addVideosAsFeeds}>Add to project</a>;
                button2 = <a href="#" className="o-btn o-btn--secondary" onClick={this._setDefaultState}>I don&apos;t want to add any videos</a>;
            }
        }
        

        var moveFeedModal = <Modal
                                isOpen={this.state.moveFeedModal}
                                onRequestClose={this._moveFeedCancel}
                                style={modalStyles}> 
                                <ModalProjectChoice
                                    closeModal={this._moveFeedCancel}
                                    heading='Select Project'
                                    text='Where would you like to move your selected feeds?'
                                    projects={this.state.projects}
                                    projectClick={this._moveToProject} />
                             </Modal>
        
        return (
            <div className={blurClasses}>
                <div ref="header">
                    <HeaderContainer />
                </div>
                <div className="o-layout">
                    <div className="o-layout__item u-1/4@tablet u-1/5@desktop u-1/6@wide">
                        <ProjectsListContainer
                            windowHeight={this.state.windowHeight}
                            modalOpen={this._modalOpen}
                            modalClose={this._modalClose}
                            projects={this.state.projects}
                            selectProject={this._selectProject}
                            selectedProjectId={this.state.selectedProjectId}
                            newProject={this._addNewProject} />
                    </div>
                    <div className="o-layout__item u-3/4@tablet u-4/5@desktop u-5/6@wide">
                        <div style={ScrollPaneStyle} className="scrollPane">
                            <div className="scrollPane__content">
                                {heading}
                                <div className={this.state.moveProjects === true ? 'o-layout o-layout--auto o-layout--middle u-margin-bottom' : 'o-layout u-margin-bottom'}>
                                    <div className="o-layout__item u-2/5@desktop u-1/2@wide">
                                        {createFeed}
                                        {selectedFeedCount}
                                    </div>
                                    <div className="o-layout__item u-3/5@desktop u-1/2@wide">
                                        {button1}
                                        {button2}
                                    </div>
                                </div>
                                <FeedListContainer
                                    feeds={this.state.feeds}
                                    showFeeds={this.state.showFeeds}
                                    modalOpen={this._modalOpen}
                                    modalClose={this._modalClose}
                                    toggleMoveMode={this._moveProjectsModeToggle}
                                    selectedCount={this._selectedFeedCount}
                                    projectId={this.state.selectedProjectId}
                                    cancelMove={this.state.moveProjects}
                                    addFeedForMove={this._addFeedForMove}
                                    removeFeedFromMove={this._removeFeedFromMove}
                                    loadFeeds={this._loadFeedsFromServer}
                                    vimeoModeBool={this.state.vimeoMode}
                                    youtubeModeBool={this.state.youtubeMode}
                                    importErrorVimeo={this.state.importErrorVimeo}
                                    importErrorYoutube={this.state.importErrorYoutube}
                                    importErrorType={this.state.importErrorType}
                                    backToDashboard={this._selectProject} />
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
import React from 'react';
import Modal from 'react-modal';

import ProjectTitle from '../components/ProjectTitle';
import EditProjectTitle from '../components/EditProjectTitle';
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

const ProjectTitleContainer = React.createClass({
    
    getInitialState:function(){
        return {
            title:'',
            editMode:false,
            editable:false,
            deleteProjectCheck:false,
            projectIdToDelete:undefined
        };
    },

    componentDidMount:function(){
        if (this.props.projectId === 0) {
            this._allFeeds();
        } else {
            this._getProjectTitle(this.props.projectId);
        }
    },

    componentWillReceiveProps:function(nextProps) {
        if (nextProps.projectId != this.props.projectId && nextProps.projectId != 0) {
            this._getProjectTitle(nextProps.projectId);
        }
        if (nextProps.projectId === 0) {
            this._allFeeds();
        }
        if (nextProps.editable != this.state.editable && nextProps.projectId != 0) {
            this.setState({
                editable:nextProps.editable
            });
        }
    },

    _getProjectTitle:function(projectId) {
        for (var x = 0; x < this.props.projects.length; x++) {
            if (this.props.projects[x].id === projectId) {
                var title = this.props.projects[x].title;
            }
        }
        this.setState({
            title:title,
            editable:true
        });     
    },

    _allFeeds:function(){
        this.setState({
            title:'All Feeds',
            editable:false
        });
    },

    _setEditMode: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            editMode:true
        });
    },

    _cancelEdit: function(e){
        e.preventDefault();
        this.setState({
            editMode:false,
            title: this.state.title
        });
    },

    _saveEdit: function (e) {
        e.preventDefault();
        this.setState({
            editMode:false,
            title:this.state.title
        });
    },

    _handleChange: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    _deleteProject: function (e) {
        if (e) {
            e.preventDefault();
        }
        if (this.state.deleteProjectCheck) {
            this.props.handleDeleteProject(this.state.projectIdToDelete);
            this.props.modalClose();
            this.setState({
                deleteProjectCheck: false,
                projectIdToDelete:undefined
            });
        } else { 
            this.setState({
                deleteProjectCheck: true,
                projectIdToDelete:this.props.projectId
            }, function(){
                this.props.modalOpen();
            });
        }
    },

    _deleteProjectCancel: function(e) {
        e.preventDefault();
        this.props.modalClose();
        this.setState({
            deleteProjectCheck:false,
            projectIdToDelete:undefined
        });
    },

    render: function() {
        
        var deleteProjectModal = <Modal
                                    isOpen={this.state.deleteProjectCheck}
                                    onRequestClose={this._deleteProjectCancel}
                                    style={modalStyles}> 
                                    <ModalChoice
                                        closeModal={this._deleteProjectCancel}
                                        yesAction={this._deleteProject}
                                        noAction={this._deleteProjectCancel}
                                        heading='Remove project'
                                        text='Are you sure?'
                                        yesText='Yep, remove project'
                                        noText='I&apos;ve changed my mind' />
                                 </Modal>

        if (this.state.editMode) {
            return (
                <EditProjectTitle 
                    title={this.state.title}
                    handleChange={this._handleChange}
                    saveEdit={this._saveEdit}
                    cancelEdit={this._cancelEdit} />
            );
        }

        if (this.state.editable) {
            return (
                <div>
                    <ProjectTitle 
                        title={this.state.title} 
                        editable={this.state.editable}
                        setEditMode={this._setEditMode}
                        deleteProject={this._deleteProject} />
                    {deleteProjectModal}
                </div>
            );
        }
        
        return (
            <div>
                <ProjectTitle 
                    title={this.state.title} 
                    editable={this.state.editable} />
            </div>
        );
    }

});

module.exports = ProjectTitleContainer;
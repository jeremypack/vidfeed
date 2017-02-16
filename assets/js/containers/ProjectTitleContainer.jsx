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
            title:'Really long project title to test input field.v23',
            editMode:false,
            deleteProjectCheck:false
        };
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
            //this.props.handleDeleteProject(this.state.commentIdToDelete);
            this.props.modalClose();
            this.setState({
                deleteProjectCheck: false,
                projectIdToDelete:undefined
            });
        } else { 
            //var id = $(e.currentTarget).closest('.c-comment').data('id');
            this.setState({
                deleteProjectCheck: true
                // projectIdToDelete:id
            }, function(){
                this.props.modalOpen();
            });
        }
    },

    _deleteProjectCancel: function() {
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

        return (
            <div>
                <ProjectTitle 
                    title={this.state.title} 
                    editable={this.props.editable}
                    setEditMode={this._setEditMode}
                    deleteProject={this._deleteProject} />
                {deleteProjectModal}
            </div>
        );
    }

});

module.exports = ProjectTitleContainer;
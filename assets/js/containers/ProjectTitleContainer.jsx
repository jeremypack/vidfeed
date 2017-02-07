import React from 'react';

import ProjectTitle from '../components/ProjectTitle';
import EditProjectTitle from '../components/EditProjectTitle';


const ProjectTitleContainer = React.createClass({
    
    getInitialState:function(){
        return {
            title:'Really long project title to test input field.v23',
            editable:false,
            deleteProjectCheck:false
        };
    },

    _setEditMode: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            editable:true
        });
    },

    _cancelEdit: function(e){
        e.preventDefault();
        this.setState({
            editable:false,
            title: this.state.title
        });
    },

    _saveEdit: function (e) {
        e.preventDefault();
        this.setState({
            editable:false,
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
            // this.setState({
            //     deleteCommentCheck: false,
            //     commentIdToDelete:undefined
            // });
        } else { 
            var id = $(e.currentTarget).closest('.c-comment').data('id');
            this.setState({
                deleteCommentCheck: true,
                commentIdToDelete:id
            }, function(){
                this.props.modalOpen();
            });
        }
    },

    render: function() {
        
        if (this.state.editable) {
            return (
                <EditProjectTitle 
                    title={this.state.title}
                    handleChange={this._handleChange}
                    saveEdit={this._saveEdit}
                    cancelEdit={this._cancelEdit} />
            );
        }

        return (
            <ProjectTitle 
                title={this.state.title} 
                setEditMode={this._setEditMode}
                deleteProject={this._deleteProject} />
        );
    }

});

module.exports = ProjectTitleContainer;
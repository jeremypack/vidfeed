import React from 'react';
import Modal from 'react-modal';

import SingleInputInModal from '../components/SingleInputInModal';

const modalStyles = {
    overlay : {
        backgroundColor       : 'transparant'
    },
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        minWidth              : '300px',
        marginRight           : '-50%',
        padding               : '0',
        border                : '0',
        background            : 'transparant',
        borderRadius          : '0',
        transform             : 'translate(-50%, -50%)',
        transition            : 'opacity .4s ease-in-out',
        opacity               : '0',
        boxShadow             : '1px 1px 4px -1px rgba(0,0,0,.25)'
    }
};

const ProjectsListContainer = React.createClass({

    getInitialState: function() {
        return {
            projects: [
                {
                    'id': 0,
                    'body':'My first vidfeed project'
                },
                {
                    'id': 1,
                    'body':'Second'
                },
                {
                    'id': 2,
                    'body':'Third'
                }
            ],
            newProjectTitle:'',
            modalIsOpen:false,
            validationStarted:false,
            isValid:false
        };
    },

    componentWillUnmount:function(){
        clearInterval(this.validateInterval);
    },

    _selectProject: function(e) {
        e.preventDefault();
    },

    _openModal : function (e) {
        e.preventDefault();
        this.setState({
            modalIsOpen: true
        });
        this.props.modalOpen();
    },

    _closeModal : function (e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            modalIsOpen: false,
            newProjectTitle:''
        });
        this.props.modalClose();
    },

    _handleChange:function(e){
        this.setState({
            newProjectTitle:e.target.value
        });
        var validateTrigger = function() {
            if(this.state.newProjectTitle) {
                this.setState({
                    isValid:true
                });
            } else {
                this.setState({
                    isValid:false
                });
            }
        }.bind(this);
        if (!this.state.validationStarted) {
            this.setState({
                validationStarted: true
            });
            this.validateInterval = setInterval(validateTrigger,500);
        }
    },

    _handleSubmit: function(e) {
        e.preventDefault();
        var newProject = [];
        newProject.id = this.state.projects.length;
        newProject.body = this.state.newProjectTitle;
        var newProjects = this.state.projects.concat([newProject]);
        this.setState({ 
            projects: newProjects,
            newProjectTitle:''   
        });
        this._closeModal();
    },

    render: function() {
        
        var projectListStyle = {
            height:this.props.windowHeight
        }

        var projectNodes = this.state.projects.map(function(project) {
            return (
                <li className="c-projectList__item" key={project.id}><a href="#" onClick={this._selectProject}>{project.body}<i className="icon icon--arrowRight"></i></a></li>
            );
        }.bind(this));

        if (this.state.validationStarted && !this.state.isValid) {
            var valid = false;
        }
        if (this.state.validationStarted && this.state.isValid) {
            var valid = true;
        }

        var newProjectModal =    <Modal
                                    isOpen={this.state.modalIsOpen}
                                    onRequestClose={this._closeModal}
                                    style={modalStyles}>
                                    <SingleInputInModal
                                        inputType="text"
                                        placeholder="e.g. Mr Blue Sky edit"
                                        heading='New Project'
                                        closeModal={this._closeModal}
                                        handleSubmit={this._handleSubmit}
                                        isValid={valid}
                                        value={this.state.newProjectTitle}
                                        handleChange={this._handleChange} />
                                </Modal>;

        return (
            <section style={projectListStyle} className="c-projectList">
                <h3 className="c-projectList__count">6 Projects</h3>
                <ul className="o-list-bare">
                   {projectNodes}
                </ul>
                <a href="#" onClick={this._openModal} className="c-projectList__addBtn o-btn o-btn--tertiary o-btn--iconLeft o-btn--outline o-btn--small"><i className="icon icon--plusCircle"></i>Add project</a>
                {newProjectModal}
            </section>
        );
    }

});

module.exports = ProjectsListContainer;
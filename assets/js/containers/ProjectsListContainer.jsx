import React from 'react';
import Modal from 'react-modal';
import classNames from 'classnames';

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
        boxShadow             : '0px 0px 4px -1px rgba(0,0,0,.25)'
    }
};

const ProjectsListContainer = React.createClass({

    getInitialState: function() {
        return {
            projects: this.props.projects,
            newProjectTitle:'',
            modalIsOpen:false,
            validationStarted:false,
            isValid:false,
            selectedProjectId:0
        };
    },

    componentWillUnmount:function(){
        clearInterval(this.validateInterval);
    },

    componentWillReceiveProps:function(nextProps) {
        if (nextProps.projects != this.props.projects) {
            this.setState({
                projects:nextProps.projects
            });
        }
        if (nextProps.defaultProjectSelected != this.props.defaultProjectSelected) {
            this.setState({
                selectedProjectId:0
            });
        }
        if (nextProps.selectedProjectId != this.state.selectedProjectId && !nextProps.defaultProjectSelected) {
            this.setState({
                selectedProjectId:nextProps.selectedProjectId
            });
        }
    },

    _selectProject: function(e) {
        e.preventDefault();
        this.setState({
            selectedProjectId:parseInt(e.target.attributes.getNamedItem('data-project-id').value, 10)
        }, function(){
            this.props.selectProject(this.state.selectedProjectId);
        });
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
        if (!this.state.newProjectTitle) {
            return;
        }
        var newProjectTitle = this.state.newProjectTitle.trim()
        this.props.newProject(newProjectTitle, this._closeModal());
    },

    render: function() {
        
        var projectListStyle = {
            height:this.props.windowHeight
        }

        var projectNodes = this.state.projects.map(function(project) {
            if (this.state.selectedProjectId === project.id) {
                var projectItemClasses = 'c-projectList__item c-projectList__item--selected';
            } else {
                var projectItemClasses = 'c-projectList__item';
            }
            return (
                <li className={projectItemClasses} key={project.id}><a href="#" data-project-id={project.id} onClick={this._selectProject}>{project.title}<i className="icon icon--arrowRight"></i></a></li>
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
                <div className={'c-projectList__item c-projectList__item--top' + (this.state.selectedProjectId === 0 ? ' c-projectList__item--selected' : '')}><a href="#" data-project-id="0" onClick={this._selectProject}><i className="icon icon--multiple"></i>All Feeds</a></div>
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
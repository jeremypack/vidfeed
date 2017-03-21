import React from 'react';

const ModalProjectChoice = React.createClass({

    propTypes: {
        heading:        React.PropTypes.string.isRequired,
        closeModal:     React.PropTypes.func.isRequired,
        text:           React.PropTypes.string.isRequired,
        projects:       React.PropTypes.array.isRequired,
        projectClick:   React.PropTypes.func.isRequired
    },

    render:function() {
        
        var projectNodes = this.props.projects.map(function(project){
            return (
                <li className="modalProject__item" key={project.id}>
                    <a href="#" className="modalProject__link" onClick={this.props.projectClick} data-project-id={project.id}>{project.title}</a>
                </li>
            )
        }.bind(this));

        return (
            <div className="modal__content">
                <div className="box__header">
                    <h3 className="box__title">{this.props.heading}</h3>
                    { this.props.closeModal ? <a href="#" onClick={this.props.closeModal} className="box__close">×<span className="u-hidden-visually">Close</span></a> : null }
                </div>
                <div className="modal__body">
                    <div className="u-padding-small u-padding-top">
                        <p>{this.props.text}</p>
                    </div>
                    <ul className="modalProjects__list o-list-bare u-margin-bottom-none">
                        {projectNodes}
                    </ul>
                </div>  
            </div>
        );
    }

});

module.exports = ModalProjectChoice;   
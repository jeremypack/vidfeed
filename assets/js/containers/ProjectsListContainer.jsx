import React from 'react';

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
            ]
        };
    },

    _selectProject: function(e) {
        e.preventDefault();
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

        return (
            <section style={projectListStyle} className="c-projectList">
                <h3 className="c-projectList__count">6 Projects</h3>
                <ul className="o-list-bare">
                   {projectNodes}
                </ul>
                <a href="#" className="c-projectList__addBtn o-btn o-btn--tertiary o-btn--iconLeft o-btn--outline o-btn--small"><i className="icon icon--plusCircle"></i>Add project</a>
            </section>
        );
    }

});

module.exports = ProjectsListContainer;
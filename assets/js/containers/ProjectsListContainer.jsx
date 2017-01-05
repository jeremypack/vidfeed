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

    render: function() {
        
        var projectListStyle = {
            height:this.props.windowHeight
        }

        var projectNodes = this.state.projects.map(function(project) {
            return (
                <li className="c-projectList__item" key={project.id}><a href="#">{project.body}</a></li>
            );
        });

        console.log(this.props.windowHeight,'windowHeight');

        return (
            <section style={projectListStyle} className="c-projectList">
                <ul className="o-list-bare">
                   {projectNodes}
                </ul>
            </section>
        );
    }

});

module.exports = ProjectsListContainer;
import React from 'react';
import Actions from '../components/Actions';

const ProjectTitle = React.createClass({
    

    render: function() {
        return (
            <div className="c-projectTitle">
                <h1 className="c-projectTitle__title">{this.props.title}</h1>
                <Actions
                    editAction={this.props.setEditMode} 
                    deleteAction={this.props.deleteProject} />
            </div>
        );
    }

});

module.exports = ProjectTitle;
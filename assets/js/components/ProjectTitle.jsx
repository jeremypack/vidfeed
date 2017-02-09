import React from 'react';
import Actions from '../components/Actions';

const ProjectTitle = React.createClass({
    
    render: function() {
        
        if (this.props.editable) {
            var actions = <Actions
                            editAction={this.props.setEditMode} 
                            deleteAction={this.props.deleteProject} />
        }

        return (
            <div className="c-projectTitle">
                <h1 className="c-projectTitle__title">{this.props.title}</h1>
                {actions}
            </div>
        );
    }

});

module.exports = ProjectTitle;
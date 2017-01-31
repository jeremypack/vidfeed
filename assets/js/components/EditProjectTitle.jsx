import React from 'react';

import Actions from '../components/Actions';

const EditProjectTitle = React.createClass({
    
    render:function(){
        return (
             <div className="c-projectTitle c-projectTitle--edit">
                <input type="text" size="" className="c-projectTitle__title" value={this.props.title} onChange={this.props.handleChange} />
                <Actions
                    saveAction={this.props.saveEdit} 
                    cancelAction={this.props.cancelEdit} />
            </div>
        );
    }

});

module.exports = EditProjectTitle;
import React from 'react';
import AutosizeInput from 'react-input-autosize';

import Actions from '../components/Actions';

const EditProjectTitle = React.createClass({
    
    getInitialState:function(){
        return {
            inputWidth:undefined
        };
    },

    componentDidMount:function(){
        var parentWidth = this.refs.parent.clientWidth;
        this.setState({
            inputWidth: parentWidth - 40
        });
        this.refs.input.focus();
    },

    render:function(){
        
        var inputStyles = {
            maxWidth: this.state.inputWidth
        }

        return (
            <div ref="parent">
                <div className="c-projectTitle c-projectTitle--edit">
                    <span style={inputStyles} className="input--autoWidth">
                        <AutosizeInput
                            ref="input"
                            name="edit-project-title"
                            value={this.props.title}
                            onChange={this.props.handleChange} />
                    </span>
                    <div className="c-projectTitle__actions">
                        <Actions
                            saveAction={this.props.saveEdit} 
                            cancelAction={this.props.cancelEdit} />
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = EditProjectTitle;
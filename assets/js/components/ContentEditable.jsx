import React from 'react';
import ReactDOM from 'react-dom';

const ContentEditable = React.createClass({
    
    componentDidMount:function(){
        this.refs.input.focus();
    },

    shouldComponentUpdate: function(nextProps){
        return nextProps.html !== ReactDOM.findDOMNode(this).innerHTML;
    },

    componentDidUpdate: function() {
        if ( this.props.html !== ReactDOM.findDOMNode(this).innerHTML ) {
           ReactDOM.findDOMNode(this).innerHTML = this.props.html;
        }
    },

    _emitChange: function(){
        //var strippedHtml = ReactDOM.findDOMNode(this).innerHTML.replace(/<div>/gi,'\n').replace(/<\/div>/gi,'\n');
        var html = ReactDOM.findDOMNode(this).innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    },

    render: function(){
        return (
            <div className="contenteditable"
                ref="input"
                onInput={this._emitChange} 
                onBlur={this._emitChange}
                contentEditable
                dangerouslySetInnerHTML={{__html: this.props.html}}></div>
        );
    }

});

module.exports = ContentEditable;
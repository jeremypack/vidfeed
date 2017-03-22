import React from 'react';

const SaveActions = React.createClass({
    
    render: function() {
        return (
            <div className="c-comment__actions">
                <ul className="o-list-inline">
                    <li className="o-list-inline__item"><input type="submit" className="icon icon--tick" title="Save change" onClick={this.props.saveAction} value="Save change" /></li>
                    <li className="o-list-inline__item"><a title="Cancel change" onClick={this.props.cancelAction} href="#"><i className="icon icon--cross"></i><span className="u-hidden-visually">Cancel</span></a></li>
                </ul> 
            </div>
        );
    }

});

module.exports = SaveActions;
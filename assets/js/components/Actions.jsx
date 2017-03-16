import React from 'react';
import classNames from 'classnames';

const Actions = React.createClass({
    
    render: function() {
        
        if (this.props.replyAction) {
            var replyAction = <li className="o-list-inline__item"><div className="c-action__item c-action--reply" title="Reply" onClick={this.props.replyAction}><i className="icon icon--replyArrow"></i><span className="u-hidden-visually">reply</span></div></li>; 
        }

        if (this.props.editAction) {
            var editAction = <li className="o-list-inline__item"><div className="c-action__item c-action--edit" title="Edit" onClick={this.props.editAction}><i className="icon icon--pencil"></i><span className="u-hidden-visually">edit</span></div></li>;
        }

        if (this.props.deleteAction) {
            var deleteAction = <li className="o-list-inline__item"><div className="c-action__item c-action--delete" title="Delete" onClick={this.props.deleteAction}><i className="icon icon--delete"></i><span className="u-hidden-visually">delete</span></div></li>;
        }

        if (this.props.saveAction) {
            
            var submitClasses = classNames({
                'c-action__item c-action--save icon icon--tick':true,
                'c-action--save--disabled':!this.props.isValid
            });

            var saveAction = <li className="o-list-inline__item"><input type="submit" className={submitClasses} title="Save change" onClick={this.props.saveAction} value="Save change" /></li>;
        }

        if (this.props.cancelAction) {
            var cancelAction = <li className="o-list-inline__item"><div className="c-action__item c-action--cancel" title="Cancel" onClick={this.props.cancelAction}><i className="icon icon--cross"></i><span className="u-hidden-visually">Cancel</span></div></li>;
        }

        if (this.props.addAction) {
            var addAction = <li className="o-list-inline__item"><div className="c-action__item c-action--add" title="Add" onClick={this.props.addAction}><i className="icon icon--add"></i><span className="u-hidden-visually">Add</span></div></li>;
        }

        return (
            <div className="c-actions">
                <ul className="o-list-inline">
                    {addAction}
                    {replyAction}
                    {editAction}
                    {deleteAction}
                    {saveAction}
                    {cancelAction}
                </ul> 
            </div>
        );

    }

});

module.exports = Actions;
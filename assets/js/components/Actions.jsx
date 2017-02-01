import React from 'react';

const Actions = React.createClass({
    
    render: function() {
        
        if (this.props.replyAction) {
            var replyAction = <li className="o-list-inline__item"><a className="c-comment__toggleReply" title="Reply" onClick={this.props.replyAction} href="#"><i className="icon icon--replyArrow"></i><span className="u-hidden-visually">reply</span></a></li>; 
        }

        if (this.props.editAction) {
            var editAction = <li className="o-list-inline__item"><a className="c-comment__editComment" title="Edit comment" onClick={this.props.editAction} href="#"><i className="icon icon--pencil"></i><span className="u-hidden-visually">edit</span></a></li>;
        }

        if (this.props.deleteAction) {
            var deleteAction = <li className="o-list-inline__item"><a className="c-comment__deleteComment" title="Delete comment" onClick={this.props.deleteAction} href="#"><i className="icon icon--cross"></i><span className="u-hidden-visually">delete</span></a></li>;
        }

        if (this.props.saveAction) {
            var saveAction = <li className="o-list-inline__item"><input type="submit" className="c-comment__saveEdit icon icon--tick" title="Save change" onClick={this.props.saveAction} value="Save change" /></li>;
        }

        if (this.props.cancelAction) {
            var cancelAction = <li className="o-list-inline__item"><a className="c-comment__cancelEdit" title="Cancel change" onClick={this.props.cancelAction} href="#"><i className="icon icon--cross"></i><span className="u-hidden-visually">Cancel</span></a></li>;
        }

        return (
            <div className="c-actions">
                <ul className="o-list-inline">
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
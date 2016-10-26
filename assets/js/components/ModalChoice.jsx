var React = require('react');

var ModalChoice = React.createClass({

    render:function() {
        if (this.props.confirmOwner) {
            var confirmOwner = <p>{this.props.confirmOwner}</p>
        }

        if (this.props.submitted) {
            return (
                <div>{this.props.submittedMsg}</div>
            )
        }
        return (
            <div className="modal__content">
                <div className="modal__header">
                    <h3 className="modal__title">{this.props.heading}</h3>
                    <a href="#" onClick={this.props.closeModal} className="modal__close">×<span className="u-hidden-visually">Close</span></a>
                </div>
                <div className="u-padding-small u-padding-top">
                    <p>{this.props.text}</p>
                    {confirmOwner}
                    <ul className="o-list-inline u-padding-top-small">
                        <li className="o-list-inline__item">
                            <a href="#" onClick={this.props.yesAction} className="o-btn o-btn--tertiary o-btn--small">Yes</a>
                        </li>&nbsp;&nbsp;
                        <li className="o-list-inline__item">
                            <a href="#" onClick={this.props.noAction} className="o-btn o-btn--tertiary o-btn--small">No</a>
                        </li>
                    </ul>
                </div>
                    
            </div>
        );
    }

});

module.exports = ModalChoice;
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
            <div>
                <a href="#" onClick={this.props.closeModal}>Close</a>
                <h2>{this.props.heading}</h2>
                <p>{this.props.text}</p>
                {confirmOwner}
                <ul className="o-list-inline">
                    <li className="o-list-inline__item">
                        <a href="#" onClick={this.props.yesAction}>Yes</a>
                    </li>
                    <li className="o-list-inline__item">
                        <a href="#" onClick={this.props.noAction}>No</a>
                    </li>
                </ul>
            </div>
        );
    }

});

module.exports = ModalChoice;
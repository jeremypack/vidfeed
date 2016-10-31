var React = require('react');

var ModalInner = React.createClass({
    
    propTypes: {
        heading:        React.PropTypes.string.isRequired,
        closeModal:     React.PropTypes.func.isRequired,
    },

    render: function() {


        return (
            <div className="modal__content">
                <div className="modal__header">
                    <h3 className="modal__title">{this.props.heading}</h3>
                    <a href="#" onClick={this.props.closeModal} className="modal__close">×<span className="u-hidden-visually">Close</span></a>
                </div>
                {this.props.children}
            </div>
        );
    }
});

module.exports = ModalInner;
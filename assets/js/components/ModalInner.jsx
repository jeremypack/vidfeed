import React from 'react';

const ModalInner = React.createClass({
    
    propTypes: {
        heading:        React.PropTypes.string.isRequired,
        closeModal:     React.PropTypes.func.isRequired,
    },

    render: function() {


        return (
            <div className="modal__content">
                <div className="box__header">
                    <h3 className="box__title">{this.props.heading}</h3>
                    <a href="#" onClick={this.props.closeModal} className="modal__close">×<span className="u-hidden-visually">Close</span></a>
                </div>
                <div className="modal__body">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

module.exports = ModalInner;
import React from 'react';
import classNames from 'classnames';

const SingleInputInModal = React.createClass({
    
    propTypes: {
        heading:        React.PropTypes.string.isRequired,
        inputType:      React.PropTypes.string.isRequired,
        placeholder:    React.PropTypes.string.isRequired,
        closeModal:     React.PropTypes.func,
        isValid:        React.PropTypes.bool,
        handleSubmit:   React.PropTypes.func.isRequired,
        value:          React.PropTypes.string.isRequired,
        text:           React.PropTypes.string,
        smallText:      React.PropTypes.string,
        submitted:      React.PropTypes.bool,
        submittedMsg:   React.PropTypes.string
    },

    componentDidMount:function() {
        setTimeout(function(){
            this.refs.inputField.focus();
        }.bind(this),200);  
    },

    render: function() {
        if (this.props.submitted) {
            return (
                <div className="modal__submitted">
                    <h3 className="box__title">{this.props.submittedMsg}</h3>
                </div>
            );
        }

        if (this.props.text) {
            var text =      <div className="u-padding-small u-padding-top u-padding-bottom-none">
                                <p className="u-margin-bottom-none">{this.props.text}</p>
                            </div>;              
        }

        if (this.props.smallText) {
            var smallText = <div className="u-padding-small u-padding-bottom-none smallprint"
                                dangerouslySetInnerHTML={{__html: this.props.smallText}} />;
        }

        var submitClasses = classNames({
            'o-btn o-btn--primary o-btn--small':true,
            'o-btn--disabled':!this.props.isValid
        });

        return (
            <div className="modal__content">
                <div className="box__header">
                    <h3 className="box__title">{this.props.heading}</h3>
                    { this.props.closeModal ? <a href="#" onClick={this.props.closeModal} className="box__close">×<span className="u-hidden-visually">Close</span></a> : null }
                </div>
                <div className="modal__body">
                    {text}
                    {smallText}
                    <form className="form--border" onSubmit={this.props.handleSubmit}>
                        <div className="u-padding-small u-padding-top u-padding-bottom">
                            <div className="input-with-button">
                                <label htmlFor={this.props.inputType} className="u-hidden-visually">Email address</label>
                                <input ref="inputField" id={this.props.inputType} type={this.props.inputType} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.handleChange} className="input--border" />
                                <input type="submit" className={submitClasses} value="Submit" />
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>
        );
    }
});

module.exports = SingleInputInModal;
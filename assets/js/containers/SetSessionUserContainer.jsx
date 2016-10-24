var React = require('react');

var EmailForm = require('../components/EmailForm');

var SetSessionUserContainer = React.createClass({
    
    propTypes: {
        modalHeading:       React.PropTypes.string.isRequired,
        submittedMsg:       React.PropTypes.string.isRequired,
        extraText:          React.PropTypes.string,
        onSubmit:           React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            user:                   '',
            submitted:              false,
            validationStarted:      false,
            isValid:                false,
            submitted:              false
        };
    },

    componentWillUnmount: function() {
        clearInterval(this.validateInterval);
    },

    _handleChange: function(e) {
        this.setState({
            user: e.target.value
        });
        var validateTrigger = function() {
            this._validate();
        }.bind(this);
        if (!this.state.validationStarted) {
            this.setState({
                validationStarted: true
            });
            this.validateInterval = setInterval(validateTrigger,1000);
        }
    },

    _handleSubmit: function(e) {
        e.preventDefault();
        window.vidfeed.user.email = this.state.user;
        this.props.onSubmit();
        this.setState({
            submitted:true
        });
    },

    _closeModal: function(e) {
        e.preventDefault();
    },

    _validate:function(){
        var checkEmail = function(email) {
            var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(email);
        }
        if (checkEmail(this.state.user)) {
            this.setState({
                isValid:true
            });
        } else {
            this.setState({
                isValid:false
            });
        }
    },

    render: function() {
        if (this.state.validationStarted && !this.state.isValid) {
            var valid = false;
        }
        if (this.state.validationStarted && this.state.isValid) {
            var valid = true;
        }

        return (
            <EmailForm
                heading={this.props.modalHeading}
                text={this.props.extraText}
                closeModal={this._closeModal}
                handleSubmit={this._handleSubmit}
                isValid={valid}
                value={this.state.user}
                handleChange={this._handleChange}
                submitted={this.state.submitted}
                submittedMsg={this.props.submittedMsg} />
        );
    }





});

module.exports = SetSessionUserContainer;
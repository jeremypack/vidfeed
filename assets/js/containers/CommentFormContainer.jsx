var React = require('react');
var Modal = require('react-modal');

var CommentForm = require('../components/CommentForm');

var EmailForm = require('../components/EmailForm');

const modalStyles = {
    overlay : {
        backgroundColor       : 'transparant'
    },
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        minWidth              : '300px',
        marginRight           : '-50%',
        padding               : '0',
        border                : '0',
        borderRadius          : '0',
        transform             : 'translate(-50%, -50%)',
        transition            : 'opacity .4s ease-in-out',
        opacity               : '0',
        boxShadow             : '1px 1px 4px -1px rgba(0,0,0,.25)'
    }
};

var CommentFormContainer = React.createClass({
    
    getInitialState: function() {
        return {
            modalIsOpen: false,
            modalSubmitted: false,
            commentIsValid:false,
            commentValidationStarted:false,
            authorIsValid:false,
            authorValidationStarted:false,
            returnToSubmit:false,
            author: '',
            comment: ''
        };
    },

    componentDidMount: function() {
        this._getSessionUser();
    },

    componentWillUnmount: function() {
        clearInterval(this.commentValidateInterval);
        clearInterval(this.authorValidateInterval);
    },

    _getSessionUser: function() {
        if (window.vidfeed.user.email) {
            this.setState({
                author:window.vidfeed.user.email
            });
        }
    },

    _handleAuthorChange: function(e) {
        this.setState({
            author: e.target.value
        });
        var authorValidateTrigger = function() {
            this._authorValidate();
        }.bind(this);
        if (!this.state.authorValidationStarted) {
            this.setState({
                authorValidationStarted: true
            });
            this.authorValidateInterval = setInterval(authorValidateTrigger,1000);
        }
    },

    _handleAuthorSubmit: function(e) {
        e.preventDefault();
        window.vidfeed.user.email = this.state.author;
        this.setState({
            modalSubmitted:true
        });
        setTimeout(function() {
            this._closeModal();
            this._handleCommentSubmit();
        }.bind(this), 2000);
    },

    _handleCommentChange: function(e) {
        this.setState({
            comment: e.target.value
        });
        var commentValidateTrigger = function() {
            if(this.state.comment) {
                this.setState({
                    commentIsValid:true
                });
            } else {
                this.setState({
                    commentIsValid:false
                });
            }
        }.bind(this);
        if (!this.state.commentValidationStarted) {
            this.setState({
                commentValidationStarted: true
            });
            this.commentValidateInterval = setInterval(commentValidateTrigger,1000);
        }
    },

    _handleCommentSubmit: function(e) {
        if (e) {
            e.preventDefault();
        }
        this._getSessionUser();
        var comment = {};
        var body = this.state.comment.trim();
        if (!window.vidfeed.user.email) {
            this.setState({
                modalIsOpen:true
            });
            this.props.modalOpen();
            return;
        }
        var timecode = this.props.timecodeSeconds;
        comment.author = window.vidfeed.user.email;
        comment.body = body;
        comment.timecode = timecode;
        $.ajax({
            url: '/api/feeds/' + this.props.feedId + '/comments',
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                this.setState({
                    comment:''
                });
                this.props.commentSubmitted(null, 'open');
            }.bind(this),
            error: function(data) {
                console.log(JSON.parse(data.responseText),'handleCommentSubmit error');
            }.bind(this)
        });
    },

    _handleKeyPress: function(target) {
        if (this.state.returnToSubmit && target.charCode===13) {
            console.log('reutrn to sibit');
            this._handleCommentSubmit();
        }
    },

    _closeModal : function (e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            modalIsOpen: false
        });
        this.props.modalClose();
    },

    _authorValidate:function(){
        var checkEmail = function(email) {
            var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(email);
        }
        if (checkEmail(this.state.author)) {
            this.setState({
                authorIsValid:true
            });
        } else {
            this.setState({
                authorIsValid:false
            });
        }
    },

    _returnToSubmitSwitch:function() {
        this.setState({
            returnToSubmit:!this.state.returnToSubmit
        });
        if (this.state.returnToSubmit) {

        }
    },

    render: function() {
        
        if (this.state.authorValidationStarted && !this.state.authorIsValid) {
            var valid = false;
        }
        if (this.state.authorValidationStarted && this.state.authorIsValid) {
            var valid = true;
        }

        var commentAuthorModal =    <Modal
                                        isOpen={this.state.modalIsOpen}
                                        onRequestClose={this._closeModal}
                                        style={modalStyles}>
                                        <EmailForm
                                            heading='Please tell us who you are'
                                            closeModal={this._closeModal}
                                            handleSubmit={this._handleAuthorSubmit}
                                            isValid={valid}
                                            value={this.state.author}
                                            handleChange={this._handleAuthorChange}
                                            submitted={this.state.modalSubmitted}
                                            submittedMsg='Thanks!' />
                                    </Modal>;

        return (
            <div>           
                <CommentForm
                    isValid={this.state.commentIsValid}
                    timecode={this.props.timecode}
                    body={this.state.comment}
                    handleSubmit={this._handleCommentSubmit}
                    handleCommentChange={this._handleCommentChange}
                    handleKeyPress={this._handleKeyPress}
                    returnToSubmitSwitch={this._returnToSubmitSwitch}
                    returnToSubmitBool={this.state.returnToSubmit} />
                {commentAuthorModal}
            </div>
        );
    }
});

module.exports = CommentFormContainer;
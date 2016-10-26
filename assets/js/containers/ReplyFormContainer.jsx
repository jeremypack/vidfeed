var React = require('react');
var Modal = require('react-modal');

var ReplyForm = require('../components/ReplyForm');
var SetSessionUserContainer = require('../containers/SetSessionUserContainer');

const modalStyles = {
    overlay : {
        backgroundColor       : 'transparant'
    },
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        padding               : '0',
        border                : '0',
        borderRadius          : '0',
        transform             : 'translate(-50%, -50%)',
        transition            : 'opacity .4s ease-in-out',
        opacity               : '0'
    }
};

var ReplyFormContainer = React.createClass({
    
    propTypes: {
        parentId:       React.PropTypes.number.isRequired,
        submitted:      React.PropTypes.func.isRequired,
        modalOpen:      React.PropTypes.func.isRequired,
        modalClose:     React.PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {
            comment: '',
            parentId: this.props.parentId,
            validationStarted:false,
            isValid:false,
            modalIsOpen: false,
            setSession: false
        };
    },

    componentWillUnmount: function() {
        clearInterval(this.validateInterval);
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

    _handleReplyChange: function(e) {
        this.setState({
            comment: e.target.value
        });
        var validateTrigger = function() {
            if(this.state.comment) {
                this.setState({
                    isValid:true
                });
            } else {
                this.setState({
                    isValid:false
                });
            }
        }.bind(this);
        if (!this.state.validationStarted) {
            this.setState({
                validationStarted: true
            });
            this.validateInterval = setInterval(validateTrigger,1000);
        }
    },

    _handleReplySubmit: function(e) {
        if (e) {
            e.preventDefault();
        }
        if (!window.vidfeed.user.email) {
            this.setState({
                setSession: true
            });
            this.props.modalOpen();
            return;
        }
        var body = this.state.comment.trim();
        var parentId = this.state.parentId;
        if (!body) {
            return;
        }
        var comment = {};
        comment.author = window.vidfeed.user.email;
        comment.body = body;
        comment.parent_id = parentId;
        $.ajax({
            url: '/api/feeds/' + this.props.feedId + '/comments',
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                this.props.submitted();
                clearInterval(this.validateInterval);
                // if (this.state.setSession) {
                //     setTimeout(function(){
                        this._closeModal();
                //     }.bind(this),2000);
                // }
                
            }.bind(this),
            error: function(data) {
                console.log(JSON.parse(data.responseText),'handleCommentSubmit error');
            }.bind(this)
        });
    },

    render: function() {
        
        if (this.state.setSession) {
            return (
                <div>
                    <Modal
                        isOpen={true}
                        onRequestClose={this._closeModal}
                        style={modalStyles}>
                        <SetSessionUserContainer
                            modalHeading='Please tell us who you are?'
                            submittedMsg='Thanks!'
                            onSubmit={this._handleReplySubmit} />
                    </Modal>
                </div>
            );
        }

        return (
            <ReplyForm
                isValid={this.state.isValid}
                handleReplySubmit={this._handleReplySubmit}
                handleReplyChange={this._handleReplyChange} />
        );
    }
});

module.exports = ReplyFormContainer;
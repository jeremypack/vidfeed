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
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        transition            : 'opacity .4s ease-in-out',
        opacity               : '0'
    }
};

var CommentFormContainer = React.createClass({
    
    getInitialState: function() {
        return {
            modalIsOpen: false,
            modalSubmitted: false,
            author: '',
            comment: ''
        };
    },

    componentDidMount: function() {
        if (window.vidfeed.user.email) {
            this.setState({
                author:window.vidfeed.user.email
            });
        }
    },

    _handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
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
        this.setState({comment: e.target.value});
    },

    _handleCommentSubmit: function(e) {
        if (e) {
            e.preventDefault();
        }
        var comment = {};
        var author = this.state.author.trim();
        var body = this.state.comment.trim();
        if (!author) {
            this.setState({
                modalIsOpen:true
            });
            this.props.modalOpen();
            return;
        }
        var timecode = this.props.timecodeSeconds;
        comment.author = author;
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

    _closeModal : function (e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            modalIsOpen: false
        });
        this.props.modalClose();
    },

    render: function() {
        
        var commentAuthorModal =    <Modal
                                        isOpen={this.state.modalIsOpen}
                                        onRequestClose={this._closeModal}
                                        style={modalStyles}>
                                        <EmailForm
                                            heading='Please tell us who you are'
                                            closeModal={this._closeModal}
                                            handleSubmit={this._handleAuthorSubmit}
                                            value={this.state.author}
                                            handleChange={this._handleAuthorChange}
                                            submitted={this.state.modalSubmitted}
                                            submittedMsg='Thanks!' />
                                    </Modal>;

        return (
            <div>           
                <CommentForm
                    timecode={this.props.timecode}
                    body={this.state.comment}
                    handleSubmit={this._handleCommentSubmit}
                    handleCommentChange={this._handleCommentChange} />
                {commentAuthorModal}
            </div>
        );
    }
});

module.exports = CommentFormContainer;
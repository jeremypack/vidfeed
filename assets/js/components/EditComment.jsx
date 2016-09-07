var React = require('react');

var EditComment = React.createClass({
    
    render: function() {
        return (
            <div className="comment" data-id={this.props.id}>
                <input type="text" onChange={this.props.handleChange} value={this.props.value} />
                <a onClick={this.props.saveChange} href="#">save</a>&nbsp;&nbsp;
                <a onClick={this.props.cancelChange} href="#">cancel</a>
            </div>
        );
    }

});

module.exports = EditComment;
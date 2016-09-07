var React = require('react');

var CreateFeed = React.createClass({
    render: function() {
        return (
            <div>
                <form className="loginForm" onSubmit={this.props.submitHandler}>
                    <input type="text" placeholder="Enter your YouTube or Vimeo URL" value={this.props.value} onChange={this.props.changeHandler} />
                    <input type="submit" value="Create Feed"/>
                </form>
                <div>{this.props.details}</div>
                <label>{this.props.error}</label>
            </div>
        );
    }
});

module.exports = CreateFeed;
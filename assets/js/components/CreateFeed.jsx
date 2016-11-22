var React = require('react');
var classNames = require('classnames');

var CreateFeed = React.createClass({
    
    propTypes: {
        isValid:            React.PropTypes.bool,
        submitHandler:      React.PropTypes.func.isRequired,
        value:              React.PropTypes.string,
        changeHandler:      React.PropTypes.func.isRequired

    },

    render: function() {
        
        var submitClasses = classNames({
            'form--single__submit o-btn o-btn--primary':true,
            'o-btn--disabled':!this.props.isValid
        });

        return (
            <form className="form--single" onSubmit={this.props.submitHandler}>
                <div className="o-layout o-layout--flush">
                    <div className="o-layout__item u-4/5@tablet">
                        <input type="url" className="form--single__input" placeholder="Paste a YouTube or Vimeo URL" value={this.props.value} onInput={this.props.changeHandler} />
                    </div>
                    <div className="o-layout__item u-1/5@tablet">
                        <input type="submit" value="Create" className={submitClasses} />
                    </div>
                </div>
            </form>
        );
    }
});

module.exports = CreateFeed;
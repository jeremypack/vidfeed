var React = require('react');

var CreateFeed = React.createClass({
    render: function() {
        return (
            <form className="form--single" onSubmit={this.props.submitHandler}>
                <div className="o-layout o-layout--flush">
                    <div className="o-layout__item u-4/5@tablet">
                        <input type="url" className="form--single__input" placeholder="Paste a YouTube or Vimeo URL" value={this.props.value} onChange={this.props.changeHandler} />
                    </div>
                    <div className="o-layout__item u-1/5@tablet">
                        <input type="submit" value="Create" className="form--single__submit o-btn o-btn--primary"/>
                    </div>
                </div>
            </form>
        );
    }
});

module.exports = CreateFeed;
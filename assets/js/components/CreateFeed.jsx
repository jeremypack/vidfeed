var React = require('react');

var CreateFeed = React.createClass({
    render: function() {
        return (
            <main className="hero">
                <h1>Make timecoded notes on <span className="nowrap">any video</span>.</h1>
                <p>Plus it&apos;s free and unlimited. No account required.</p>
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
                <div className="o-box">
                    <a href="#" className="o-btn o-btn--ghost u-margin-bottom">View Demo</a>
                    <a href="#" className="o-btn u-margin-bottom">or Learn More</a>
                </div>
                <div>{this.props.details}</div>
                <label>{this.props.error}</label>
            </main>
        );
    }
});

module.exports = CreateFeed;
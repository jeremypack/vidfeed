var React = require('react');

var HeaderContainer =               require('../containers/HeaderContainer');
var CreateFeedContainer =           require('../containers/CreateFeedContainer');

var Home = React.createClass({
    
    render: function() {
        return ( 
            <div className="homePage">
                <HeaderContainer isHomepage={true} />
                <main className="hero">
                    <h1>Make timecoded notes on <span className="nowrap">any video</span>.</h1>
                    <p>Plus it&apos;s free and unlimited. No account required.</p>
                    <CreateFeedContainer />
                    <div className="o-box">
                        <a href="#" className="o-btn o-btn--ghost u-margin-bottom">View Demo</a>
                        <a href="#" className="o-btn u-margin-bottom">or Learn More</a>
                    </div>
                </main>
            </div>
        );
    }
    
});

module.exports = Home;
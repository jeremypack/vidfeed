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
                </main>
            </div>
        );
    }
    
});

module.exports = Home;
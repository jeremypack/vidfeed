var React = require('react');

var HeaderContainer =               require('../containers/HeaderContainer');
var CreateFeedContainer =           require('../containers/CreateFeedContainer');

var Home = React.createClass({
    
    render: function() {
        return ( 
            <div className="homePage">
                <HeaderContainer isHomepage={true} />
                <main className="hero">
                    <h1>Simple Video <span className="nowrap">Collaboration</span>.</h1>
                    <p>Make and receive timecoded notes on any Youtube or Vimeo video, for free.</p>
                    <CreateFeedContainer />
                </main>
            </div>
        );
    }
    
});

module.exports = Home;
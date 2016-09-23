var React = require('react');

var HeaderContainer =               require('../containers/HeaderContainer');
var CreateFeedContainer =           require('../containers/CreateFeedContainer');

var Home = React.createClass({
    
    render: function() {
        return ( 
            <div>
                <HeaderContainer isHomepage={true} />
                <CreateFeedContainer />
            </div>
        );
    }
    
});

module.exports = Home;
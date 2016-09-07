var React = require('react');

var CreateFeedContainer = require('../containers/CreateFeedContainer');

var Home = React.createClass({
    
    render: function() {
        return ( 
            <div>
                <CreateFeedContainer />
            </div>
        );
    }
    
});

module.exports = Home;
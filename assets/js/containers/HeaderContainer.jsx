var React = require('react');

var Header = require('../components/Header');

var HeaderContainer = React.createClass({
    
    getInitialState: function() {
        return {
            isHomepage:false,
            isLoggedIn:false
        };
    },

    componentWillMount: function() {
        if (this.props.isHomepage) {
            this.setState({ isHomepage:true });
        }

        if (this.props.isLoggedIn) {
            this.setState({ isLoggedIn:true });
        }
    },

    render: function() {
        return (
            <Header isHomepage={this.state.isHomepage} />
        );
    }

});

module.exports = HeaderContainer;
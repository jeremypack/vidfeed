import React from 'react';

import Header from '../components/Header';

const HeaderContainer = React.createClass({
    
    propTypes: {
        isHomepage:         React.PropTypes.bool,
        isLoggedIn:         React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isHomepage:false,
            isLoggedIn:false
        };
    },

    componentWillMount: function() {
        if (this.props.isHomepage) {
            this.setState({ 
                isHomepage:true
            });
        }

        if (this.props.isLoggedIn) {
            this.setState({
                isLoggedIn:true
            });
        }
    },

    render: function() {
        return (
            <Header isHomepage={this.state.isHomepage} />
        );
    }

});

module.exports = HeaderContainer;
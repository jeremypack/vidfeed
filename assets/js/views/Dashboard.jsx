import React from 'react';

import HeaderContainer from '../containers/HeaderContainer';
import ProjectsListContainer from '../containers/ProjectsListContainer';
import FeedListContainer from '../containers/FeedListContainer';

const Dashboard = React.createClass({

    render: function() {
        return (
            <div>
                <HeaderContainer />
                <ProjectsListContainer />
                <FeedListContainer />
            </div>
        );
    }

});

module.exports = Dashboard;
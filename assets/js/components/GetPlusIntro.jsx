import React from 'react';

const GetPlusIntro = React.createClass({
    
    render: function() {
        return (
            <section className="text--center">
                <div className="c-getPlus__hero pastelSwatch--322">
                    <h2>Get Vidfeed plus</h2>
                    <p>Get more out of Vidfeed, get plus</p>
                </div>
                <div className="c-getPlus__content">
                    <ul>
                        <li>Vimeo and Youtube Integration</li>
                        <li>Comment Todo List</li>
                        <li>Draw on video frames</li>
                        <li>Dashboard Organisation</li>
                        <li>Unlimited Feeds</li>
                    </ul>
                    <a href="#" onClick={this.props.next} className="o-btn o-btn--primary">Sign up</a>
                </div>
            </section>
        );
    }

});

module.exports = GetPlusIntro;
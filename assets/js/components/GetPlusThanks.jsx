import React from 'react';

const GetPlusThanks = React.createClass({
    
    render: function() {
        return (
            <section className="text--center">
                <div className="c-getPlus__hero pastelSwatch--88">
                    <h2>Thanks for your interest</h2>
                    <p>Get more out of Vidfeed, get plus</p>
                </div>
                <div className="c-getPlus__content o-layout">
                    <div className="o-layout__item u-3/4@tablet">
                        <p>We’re currently working extra hard to get these features released. We’ll be sure to drop you an email when we launch.</p>
                        <p>If you’d like to give us any feedback then please drop us an email, <a href="mailto:jeremy@vidfeed.io">jeremy@vidfeed.io</a>. We’d love to hear your thoughts.</p>
                    </div>
                </div>
            </section>
        );
    }

});

module.exports = GetPlusThanks;
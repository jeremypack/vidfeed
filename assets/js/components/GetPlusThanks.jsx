import React from 'react';

const GetPlusThanks = React.createClass({
    
    render: function() {
        return (
            <section className="text--center">
                <div className="c-getPlus__hero pastelSwatch--88">
                    <h2>Thanks for your interest</h2>
                    <p>...but we're not quite finished.</p>
                </div>
                <div className="c-getPlus__content o-layout">
                    <div className="o-layout__item u-3/4@tablet">
                        <div className="u-margin-top">

                            <p>We're currently working extra hard to get these features released but I'm afraid they're not quite ready yet.</p>

                            <p>We’ll drop you an email as soon as they're done.</p>

                            <p>If you’d like to give us feedback, please fire an email to Jeremy - <a href="mailto:jeremy@vidfeed.io">jeremy@vidfeed.io</a>. </p>

                            <p>Thanks - Jeremy & Mikey</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

});

module.exports = GetPlusThanks;
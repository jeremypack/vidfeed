import React from 'react';

const GetPlusThanks = React.createClass({
    
    render: function() {
        return (
            <section className="text--center">
                <div className="c-getPlus__hero">
                    <h2>Thanks for your interest</h2>
                    <p>...but we&apos;re not quite finished.</p>
                </div>
                <div className="c-getPlus__content o-layout">
                    <div className="o-layout__item u-3/4@tablet">
                        <div className="u-margin-top">

                            <p>We&apos;re currently working extra hard to get these features released, but I&apos;m afraid they&apos;re not quite ready yet.</p>

                            <p>We&apos;ll drop you an email as soon as they&apos;re done.</p>

                            <p>If you&apos;d like to give us feedback, please email Jeremy - <a href="mailto:jeremy@vidfeed.io">jeremy@vidfeed.io</a>. </p>

                            <p>Thanks - Jeremy &amp; Mikey</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

});

module.exports = GetPlusThanks;
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
                    <div className="c-getPlus__features o-layout text--left u-margin-bottom u-padding-left">
                        <div className="o-layout__item u-1/2">
                            <p className="c-getPlus__features__item">Vimeo &amp; Youtube Integration</p>
                            <p className="c-getPlus__features__item">Dashboard Organisation</p>
                            <p className="c-getPlus__features__item">Comment Todo List</p>
                        </div>
                        <div className="o-layout__item u-1/2">
                            <p className="c-getPlus__features__item">Draw on video frames</p>
                            <p className="c-getPlus__features__item">Unlimited Feeds</p>
                            <p className="c-getPlus__features__item">Lorem Ipsum Dolar</p>
                        </div>
                        
                        
                    </div>
                    <div className="o-layout__item">
                        <a href="#" onClick={this.props.next} className="o-btn o-btn--primary">Sound good? Sign up.</a>
                    </div>
                </div>
            </section>
        );
    }

});

module.exports = GetPlusIntro;
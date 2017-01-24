import React from 'react';

const GetPlusIntro = React.createClass({

    render: function() {

        var getPlusImg = window.vidfeed.images_dir + '/getPlus.png';

        return (
            <section className="text--center">
                <div className="c-getPlus__hero">
                    <h2>Get Vidfeed plus</h2>
                </div>
                <div className="c-getPlus__content">
                    <img src={getPlusImg} alt="Vidfeed Plus screens" className="c-getPlus__img" />
                    <div className="c-getPlus__features o-layout text--left u-margin-bottom u-padding-left">
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item">
                                <i className="c-getPlus__icon icon icon--dashboard"></i>
                                <h3>Dashboard</h3>
                                <p>Keep all your videos and projects organised and easy to find with our dashboard view.</p>
                            </div>
                        </div>
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item">
                                <i className="c-getPlus__icon icon icon--todo"></i>
                                <h3>ToDo List</h3>
                                <p>Turn your comments into a actionable item and keep everyone updated on progress.</p>
                            </div>
                        </div>
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item">
                                <i className="c-getPlus__icon icon icon--vimeo"></i>
                                <h3>Vimeo & Youtube Integration</h3>
                                <p>Link your Vimeo and YouTube accounts to Vidfeed to enable seamless integration.</p>
                            </div>
                        </div>
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item">
                                <i className="c-getPlus__icon icon icon--unlimited"></i>
                                <h3>Unlimited</h3>
                                <p>Unlimited feeds*, projects, storage, and collaborators for an infinite amount of time.</p>
                            </div>
                        </div>
                        
                        
                    </div>
                    <div className="o-layout__item">
                        <a href="#" onClick={this.props.next} className="o-btn o-btn--primary">Sounds good! Sign me up.</a>
                    </div>
                </div>
            </section>
        );
    }

});

module.exports = GetPlusIntro;
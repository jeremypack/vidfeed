import React from 'react';

const GetPlusIntro = React.createClass({

    render: function() {

        var getPlusImg = window.vidfeed.images_dir + '/getPlus.png';

        return (
            <section className="text--center">
                <div className="c-getPlus__hero">
                    <h2>Vidfeed Plus</h2>
                    <p>Get more out of Vidfeed</p>
                </div>
                <div className="c-getPlus__content">
                    <img src={getPlusImg} alt="Vidfeed Plus screens" className="c-getPlus__img" />
                    <div className="c-getPlus__features o-layout text--left u-padding-left">
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item">
                                <i className="c-getPlus__icon icon icon--dashboard"></i>
                                <h3>Dashboard View</h3>
                                <p>Keep all your videos and projects organised and easy to find with our dashboard view.</p>
                            </div>
                        </div>
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item">
                                <i className="c-getPlus__icon icon icon--todo"></i>
                                <h3>ToDo List</h3>
                                <p>Turn your comments into actionable items and keep everyone updated on progress.</p>
                            </div>
                        </div>
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item">
                                <i className="c-getPlus__icon icon icon--vimeo"></i>
                                <h3>Vimeo & YouTube Integration</h3>
                                <p>View all your YouTube/Vimeo videos from within Vidfeed and upload new ones if needed.</p>
                            </div>
                        </div>
                        <div className="o-layout__item u-1/2@tablet">
                            <div className="c-getPlus__features__item">
                                <i className="c-getPlus__icon icon icon--unlimited"></i>
                                <h3>Unlimited</h3>
                                <p>Get unlimited feeds, projects and collaborators for an infinite amount of time.</p>
                            </div>
                        </div>
                    
                        
                    </div>
                    <div className="o-layout__item">
                        <a href="#" onClick={this.props.next} className="o-btn o-btn--primary">Sign me up!</a>
                    </div>
                </div>
            </section>
        );
    }

});

module.exports = GetPlusIntro;
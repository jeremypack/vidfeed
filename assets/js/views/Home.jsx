import React from 'react';
import ReactPlayer from 'react-player';

import HeaderContainer from '../containers/HeaderContainer';
import CreateFeedContainer from '../containers/CreateFeedContainer';

import YouTubePlayer from '../components/YouTubePlayer';

function is_touch_device() {
    return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}

const Home = React.createClass({
    
    getInitialState: function() {
        return {
            playerHeight:undefined,
            playing:false
        };
    },

    componentDidMount: function() {
        this._resizeContent();
        window.addEventListener('resize', this._resizeContent);
        if (!is_touch_device()) {
            window.addEventListener('scroll', this._playScreencast);
        }
    },

    componentWillUnmount:function() {
        window.removeEventListener('resize', this._resizeContent);
        window.removeEventListener('scroll', this._playScreencast);
    },

    _resizeContent:function() {
        this.setState({
            playerHeight:this.refs.playerHolder.clientHeight 
        });
    },

    _playScreencast: function() {
        if (!this.state.playing) {
            this.setState({
                playing:true
            });
        }
    },

    render: function() {

        var playerWrapperStyle = {
            height:this.state.playerHeight
        }

        var images = window.vidfeed.images_dir;

        return ( 
            <div className="homePage">
                <main className="home__hero">
                    <HeaderContainer isHomepage={true} />
                    <h1>Simple Video <span className="nowrap">Collaboration</span>.</h1>
                    <p>Make and receive timecoded notes on any Youtube or Vimeo video, for free.</p>
                    <CreateFeedContainer />
                </main>
                <section className="home__video">
                    <div className="o-wrapper">
                        <div className="c-player__wrapper" style={playerWrapperStyle}>   
                            <div className="c-player" ref="playerHolder">
                                <div className="c-player__height">
                                    <YouTubePlayer
                                        video_id='pKWLcym7zu0'
                                        playOnScroll={this.state.playing}
                                        homepage={true} />   
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="features u-padding-top-large u-padding-bottom-large">
                        <div className="o-wrapper">
                            <div className="o-layout">
                                <div className="o-layout__item u-1/3@tablet">
                                    <div className="u-margin-bottom u-padding-left u-padding-right">
                                        <div className="feature__icon"><i className="icon icon--message"></i></div>
                                        <h3>Share</h3>
                                        <p>Share your feed with clients collaborators and friends. They can review instantly, no account required.</p>
                                    </div>
                                </div>
                                <div className="o-layout__item u-1/3@tablet">
                                    <div className="u-margin-bottom u-padding-left u-padding-right">
                                        <div className="feature__icon"><i className="icon icon--bubble"></i></div>
                                        <h3>Comment</h3>
                                        <p>Every comment is timecoded to a precise part in the video making all feedback clear and easy to understand.</p>
                                    </div>
                                </div>
                                <div className="o-layout__item u-1/3@tablet">
                                    <div className="u-margin-bottom u-padding-left u-padding-right">
                                        <div className="feature__icon"><i className="icon icon--user"></i></div>
                                        <h3>Collaborate</h3>
                                        <p>Review beautifully formatted timecoded comments. Collaborate in real time or start making edits straight away.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="testimonials text--center u-padding-top-large u-padding-bottom-large">
                    <div className="o-wrapper">
                        <h3>Hear what others have to say</h3>
                        <div className="o-layout">
                            <div className="o-layout__item u-1/2@tablet">
                                <div className="testimonial u-padding-left u-padding-right">
                                    <img className="testimonial__avatar" src={images+'/riyad.png'} alt="Riyad Barmania" />
                                    <h4 className="testimonial__name">Riyad Barmania</h4>
                                    <h5 className="testimonial__title">Content Director at ChannelFlip</h5>
                                    <blockquote className="testimonial__quote">
                                        <p>Vidfeed is a great tool for collaboration, saving us lots of time and energy in a very simple way. We often work with multiple stakeholders including the client, the agency, legal, and the list goes on… It used to be very complicated but Vidfeed has really simplified our process.</p>
                                    </blockquote>
                                </div>
                            </div>
                            <div className="o-layout__item u-1/2@tablet">
                                <div className="testimonial u-padding-left u-padding-right">
                                    <img className="testimonial__avatar" src={images+'/jamie.png'} alt="Jamie Lennox" />
                                    <h4 className="testimonial__name">Jamie Lennox</h4>
                                    <h5 className="testimonial__title">Creative Director at Hotwolf</h5>
                                    <blockquote className="testimonial__quote">
                                        <p>Vidfeed has revolutionised our feedback process. It&apos;s clearer, faster, and much more precise than over described emails or long conference calls with multiple voices. We can spend more time being creative and less time bogged down in epic email chains.</p>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <a href="mailto:theteam@vidfeed.io" className="siteFooter"> Drop us a line at <strong>theteam@vidfeed.io</strong>
                </a>
            </div>
        );
    }
    
});

module.exports = Home;
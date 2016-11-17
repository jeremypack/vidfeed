var React = require('react');
var ReactPlayer = require('react-player');

var HeaderContainer =               require('../containers/HeaderContainer');
var CreateFeedContainer =           require('../containers/CreateFeedContainer');

var Home = React.createClass({
    
    getInitialState: function() {
        return {
            heroWidth:undefined,
            heroHeight:undefined,
            playerHeight:undefined
        };
    },

    componentDidMount: function() {
        this._resizeContent();
        window.addEventListener('resize', this._resizeContent);
    },

    componentWillUnmount:function() {
        window.removeEventListener('resize', this._resizeContent);
    },

    _resizeContent:function() {
        
        console.log(this.refs.playerHolder.clientHeight,'player');
        this.setState({
            heroWidth:window.innerWidth,
            heroHeight:window.innerHeight,
            playerHeight:this.refs.playerHolder.clientHeight
            
        });
    },

    render: function() {
        
        var heroStyle = {
            width:this.state.heroWidth,
            // height:this.state.heroHeight
        };

        var vimeoUrl = "https://vimeo.com/191680754";
        var vimeoConfig = {
            iframeParams : {
                color:'49c9f5'
            }
        };

        var playerWrapperStyle = {
            height:this.state.playerHeight
        }

        var images = window.vidfeed.images_dir;

        return ( 
            <div className="homePage">
                <main className="home__hero" style={heroStyle}>
                    <HeaderContainer isHomepage={true} />
                    <h1>Simple Video <span className="nowrap">Collaboration</span>.</h1>
                    <p>Make and receive timecoded notes on any Youtube or Vimeo video, for free.</p>
                    <CreateFeedContainer />
                </main>
                <section className="home__video">
                    <div className="o-wrapper">
                        <div className="c-player__wrapper" style={playerWrapperStyle}>                    
                            <div className="c-player" ref="playerHolder">
                                <div className="c-player__height" >
                                    <ReactPlayer
                                        controls={false}
                                        progressFrequency={100}
                                        width='100%'
                                        height='100%'
                                        ref='player'
                                        onReady={this._resizeVideo}
                                        onDuration={this._resizeVideo}
                                        url={vimeoUrl}
                                        vimeoConfig={vimeoConfig} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="home__features u-padding-top-large u-padding-bottom-large">
                        <div className="o-wrapper">
                            <div className="o-layout">
                                <div className="o-layout__item u-1/3@tablet">
                                    <div className="u-padding-left u-padding-right">
                                        <div className="home__features__icon"><i className="icon icon--message"></i></div>
                                        <h3>Share</h3>
                                        <p>Share your feed with clients collaborators and friends. They can review instantly, no account required.</p>
                                    </div>
                                </div>
                                <div className="o-layout__item u-1/3@tablet">
                                    <div className="u-padding-left u-padding-right">
                                        <div className="home__features__icon"><i className="icon icon--bubble"></i></div>
                                        <h3>Comment</h3>
                                        <p>Every comment is timecoded to a precise part in the video making all feedback clear and easy to understand.</p>
                                    </div>
                                </div>
                                <div className="o-layout__item u-1/3@tablet">
                                    <div className="u-padding-left u-padding-right">
                                        <div className="home__features__icon"><i className="icon icon--user"></i></div>
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
                                        <p>Vidfeed is a great tool for collaboration and saves us lots of time and energy in a very simple way. We often work with multiple stakeholders including the client, the agency, legal, and the list goes on… It used to be very complicated but Vidfeed has really simplified our process.</p>
                                    </blockquote>
                                </div>
                            </div>
                            <div className="o-layout__item u-1/2@tablet">
                                <div className="testimonial u-padding-left u-padding-right">
                                    <img className="testimonial__avatar" src={images+'/jamie.png'} alt="Jamie Lennox" />
                                    <h4 className="testimonial__name">Jamie Lennox</h4>
                                    <h5 className="testimonial__title">Creative Director at Hotwolf</h5>
                                    <blockquote className="testimonial__quote">
                                        <p>Vidfeed has revolutionised our feedback process. It&apos;s clearer, faster, and much precise than over described emails or long conference calls with multiple voices. We can spend more time being creative and less time bogged down in epic email chains.</p>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <footer></footer>
            </div>
        );
    }
    
});

module.exports = Home;
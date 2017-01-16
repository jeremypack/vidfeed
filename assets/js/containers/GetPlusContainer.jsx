import React from 'react';

import classNames from 'classnames';

import GetPlusIntro from '../components/GetPlusIntro';
import GetPlusForm from '../components/GetPlusForm';
import GetPlusThanks from '../components/GetPlusThanks';

const GetPlusContainer = React.createClass({

    propTypes: {
        show:           React.PropTypes.bool.isRequired,
        hide:           React.PropTypes.bool.isRequired,

    },

    getInitialState:function(){
        return {
            signUpStage:0,
            planSelect:'year'
        };
    },

    componentWillUnmount:function() {
        this.setState({
            signUpStage:0,
            planSelect:'year'
        });
    },

    _yearPlanSelect:function() {
        this.setState({
            planSelect:'year'
        });
    },

    _monthPlanSelect:function() {
        this.setState({
            planSelect:'month'
        });
    },

    _nextStage: function() {
        this.setState({
            signUpStage: this.state.signUpStage + 1
        });  
    },

    render:function(){
        if (this.state.signUpStage === 0) {
            var intro = <GetPlusIntro next={this._nextStage} />
        }

        if (this.state.signUpStage === 1) {
            var form = <GetPlusForm
                            yearPlanSelected={this.state.planSelect === 'year' ? true : false}
                            monthPlanSelected={this.state.planSelect === 'month' ? true : false}
                            yearPlanSelect={this._yearPlanSelect}
                            monthPlanSelect={this._monthPlanSelect}
                            next={this._nextStage} />
        }

        if (this.state.signUpStage === 2) {
            var thanks = <GetPlusThanks />
        }

        var drawerClasses = classNames({
            'o-offCanvas__drawer':true,
            'o-offCanvas__drawer--open':this.props.show
        });

        return (
            <div className={drawerClasses}>
                <div className="c-getPlus o-offCanvas__drawer__inner u-3/4 u-2/3@tablet u-1/2@desktop">
                    <div className="box__header">
                        <h3 className="box__title">Get Vidfeed plus</h3>
                        <a href="#" onClick={this.props.hide} className="box__close">×<span className="u-hidden-visually">Close</span></a>
                    </div>
                    {intro}
                    {form}
                    {thanks}
                </div>
            </div>
            
        );
    }

});

module.exports = GetPlusContainer;

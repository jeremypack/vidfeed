import React from 'react';

import classNames from 'classnames';

const GetPlusForm = React.createClass({
    
    render: function() {

        var yearPlanClasses = classNames({
            'c-getPlus__priceOption':true,
            'c-getPlus__priceOption--selected':this.props.yearPlanSelected
        });

        var monthPlanClasses = classNames({
            'c-getPlus__priceOption':true,
            'c-getPlus__priceOption--selected':this.props.monthPlanSelected
        });

        return (
            <section className="text--center">
                <div className="c-getPlus__hero pastelSwatch--175">
                    <h2>Select a payment plan</h2>
                    <p>Get more out of Vidfeed, get plus</p>
                </div>
                <div className="c-getPlus__content">
                    <form onSubmit={this.props.onSubmit} className="form--border o-layout o-layout--center">
                        <ul className="o-list-inline">
                            <li className="o-list-inline__item u-1/2 o-layout__item">
                                <a href="#" onClick={this.props.yearPlanSelect} className={yearPlanClasses}>
                                    <h3>£50</h3>
                                    <h4>Annual</h4>
                                    <p>Best value: save 17% !</p>
                                </a>
                            </li>
                            <li className="o-list-inline__item u-1/2 o-layout__item">
                                <a href="#" onClick={this.props.monthPlanSelect} className={monthPlanClasses}>
                                    <h3>£5</h3>
                                    <h4>Monthly</h4>
                                    <p>Recurring billing</p>
                                </a>
                            </li>
                        </ul>
                        <div className="u-1/1 u-2/3@tablet o-layout__item">
                            <div className="u-padding-tiny u-padding-top">
                                <input type="text" onChange={this.props.handleNameChange} value={this.props.name} placeholder="Name" className="input--border" />
                            </div>
                            <div className="u-padding-tiny">
                                <input type="email" onChange={this.props.handleEmailChange} value={this.props.email} placeholder="Email address" className="input--border" />
                            </div>
                            <div className="u-padding-tiny">
                                <input type="password" onChange={this.props.handlePasswordChange} value={this.props.password} placeholder="Password" className="input--border" />
                            </div>
                            <div className="u-margin-top text--center">
                                <input type="Submit" onClick={this.props.next} className="o-btn o-btn--primary" value="Become a plus user" />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        );
    }

});

module.exports = GetPlusForm;
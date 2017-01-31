import React from 'react';
import classNames from 'classnames';
import Collapse from 'react-collapse';

const CreateFeed = React.createClass({
    
    propTypes: {
        isValid:            React.PropTypes.bool,
        submitHandler:      React.PropTypes.func.isRequired,
        value:              React.PropTypes.string,
        changeHandler:      React.PropTypes.func.isRequired,
        isDashboard:         React.PropTypes.bool
    },

    render: function() {

        var submitClasses = classNames({
            'form--single__submit o-btn':true,
            'o-btn--primary':!this.props.isDashboard,
            'o-btn--tertiary':this.props.isDashboard,
            'o-btn--disabled':!this.props.isValid,
            'o-btn--pulse':this.props.isValid
        });

        var invalidMsg = <p>Whoops, that doesn&apos;t look like a Vimeo or Youtube URL</p>;

        return (

            <div>
                <Collapse isOpened={this.props.showInvalidMsg} className="invalidUrl">
                    {invalidMsg}
                </Collapse>
                <form className={this.props.isDashboard ? null : 'form--single'} onSubmit={this.props.submitHandler}>
                    <div className="o-layout o-layout--flush">
                        <div className="o-layout__item u-4/5@tablet">
                            <input type="url" className="form--single__input" placeholder="Paste a YouTube or Vimeo URL" value={this.props.value} onInput={this.props.changeHandler} />
                        </div>
                        <div className="o-layout__item u-1/5@tablet">
                            <input type="submit" value="Create" className={submitClasses} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = CreateFeed;
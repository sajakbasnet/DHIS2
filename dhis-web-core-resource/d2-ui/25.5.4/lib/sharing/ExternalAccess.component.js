import React, { PropTypes, createClass } from 'react';
import Translate from '../i18n/Translate.mixin';
import Toggle from 'material-ui/Toggle/Toggle';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('external_access');

export default createClass({
    propTypes: {
        externalAccess: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        onChange: PropTypes.func.isRequired
    },

    mixins: [Translate],

    onToggle: function onToggle() {
        this.props.onChange(this.refs.toggle.isToggled());
    },
    render: function render() {
        return React.createElement(Toggle, {
            ref: 'toggle',
            name: 'externalAccess',
            label: this.getTranslation('external_access'),
            checked: this.props.externalAccess,
            onToggle: this.onToggle,
            disabled: this.props.disabled
        });
    }
});
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

import { DatePicker as MuiDatePicker } from 'material-ui';

var DatePicker = function (_React$Component) {
    _inherits(DatePicker, _React$Component);

    function DatePicker(props) {
        _classCallCheck(this, DatePicker);

        var _this = _possibleConstructorReturn(this, (DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).call(this, props));

        _this.maxDate = props.allowFuture ? undefined : new Date();
        _this.props = props;
        _this._onDateSelect = _this._onDateSelect.bind(_this);
        _this._formatDate = _this._formatDate.bind(_this);
        _this.state = { value: _this.props.value };
        return _this;
    }

    _createClass(DatePicker, [{
        key: '_onDateSelect',
        value: function _onDateSelect(event, date) {
            this.setState({ value: date });
            this.props.onChange({
                target: {
                    value: date
                }
            });
        }
    }, {
        key: '_formatDate',
        value: function _formatDate(date) {
            var dd = date.getDate();
            var mm = date.getMonth() + 1;
            var yyyy = date.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }

            switch (this.props.dateFormat) {
                case "dd-MM-yyyy":
                    return dd + '-' + mm + '-' + yyyy;
                case "yyyy-MM-dd":
                    return yyyy + '-' + mm + '-' + dd;
                default:
                    return dd + '-' + mm + '-' + yyyy;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(MuiDatePicker, _extends({}, this.props, {
                    value: this.state.value,
                    floatingLabelText: this.props.floatingLabelText,
                    maxDate: this.maxDate,
                    formatDate: this._formatDate,
                    onChange: this._onDateSelect
                }))
            );
        }
    }]);

    return DatePicker;
}(React.Component);

;

DatePicker.propTypes = {
    floatingLabelText: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    dateFormat: React.PropTypes.string.isRequired,
    allowFuture: React.PropTypes.bool.isRequired
};

export default DatePicker;
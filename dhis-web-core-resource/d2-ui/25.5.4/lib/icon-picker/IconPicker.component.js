var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Popover from 'material-ui/Popover/Popover';
import IconOption from './IconOption.component';
import CurrentIcon from './CurrentIcon.component';

// TODO: Move to d2-utilizr?
function trimSlashesFromEnd(string) {
    return string.replace(/\/+?$/, '');
}

function getImgSrc(imgPath, imgFileName) {
    if (!imgFileName) {
        return '';
    }
    return [trimSlashesFromEnd(imgPath), imgFileName].filter(function (v) {
        return v;
    }).join('/');
}

var IconPicker = function (_React$Component) {
    _inherits(IconPicker, _React$Component);

    function IconPicker() {
        var _ref;

        _classCallCheck(this, IconPicker);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = IconPicker.__proto__ || Object.getPrototypeOf(IconPicker)).call.apply(_ref, [this].concat(args)));

        _this.state = {
            showOptions: false
        };

        _this._currentIconClicked = _this._currentIconClicked.bind(_this);
        _this._closeOptions = _this._closeOptions.bind(_this);
        _this._onIconSelected = _this._onIconSelected.bind(_this);
        return _this;
    }

    _createClass(IconPicker, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var styles = {
                iconPopover: {
                    paddingTop: '1rem',
                    width: '50%'
                },

                // TODO: Load partial style from material-ui
                iconPickerLabel: {
                    transformOrigin: 'left top 0px',
                    pointerEvents: 'none',
                    color: 'rgba(0, 0, 0, 0.498039)',
                    padding: '1rem 0 .5rem',
                    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                    transform: 'scale(.75)',
                    fontSize: '16px'
                }
            };

            var optionElements = this.props.options.map(function (option, index) {
                var optionProps = {
                    value: option,
                    imgSrc: [trimSlashesFromEnd(_this2.props.imgPath), option].join('/')
                };

                return React.createElement(IconOption, _extends({ key: index }, optionProps, { onIconClicked: _this2._onIconSelected }));
            });

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'icon-picker__label-text', style: styles.iconPickerLabel },
                    this.props.labelText
                ),
                React.createElement(CurrentIcon, { imgSrc: getImgSrc(this.props.imgPath, this.props.value), onIconClicked: this._currentIconClicked }),
                React.createElement(
                    Popover,
                    {
                        open: this.state.showOptions,
                        anchorEl: this.state.anchorEl,
                        onRequestClose: this._closeOptions,
                        style: Object.assign(styles.iconPopover, this.props.iconPopoverStyle)
                    },
                    optionElements
                )
            );
        }
    }, {
        key: '_currentIconClicked',
        value: function _currentIconClicked(event) {
            this.setState({
                anchorEl: event.currentTarget,
                showOptions: !this.state.showOptions
            });
        }
    }, {
        key: '_closeOptions',
        value: function _closeOptions() {
            this.setState({
                showOptions: false
            });
        }
    }, {
        key: '_onIconSelected',
        value: function _onIconSelected(event, value) {
            var _this3 = this;

            this.setState({
                showOptions: false
            }, function () {
                _this3.props.onChange(value);
            });
        }
    }]);

    return IconPicker;
}(React.Component);

IconPicker.propTypes = {
    imgPath: React.PropTypes.string,
    options: React.PropTypes.array,
    labelText: React.PropTypes.string,
    onChange: React.PropTypes.func,
    value: React.PropTypes.any,
    iconPopoverStyle: React.PropTypes.object
};

IconPicker.defaultProps = {
    imgPath: '',
    options: [],
    labelText: 'Icon picker',
    onChange: function onChange() {}
};

export default IconPicker;
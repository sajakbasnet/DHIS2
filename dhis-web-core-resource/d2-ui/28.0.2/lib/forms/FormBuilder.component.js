var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { isObject } from 'lodash';
import AsyncValidatorRunner from './AsyncValidatorRunner';

import CircularProgres from '../circular-progress/CircularProgress';

var noop = function noop() {};

var FormBuilder = function (_React$Component) {
    _inherits(FormBuilder, _React$Component);

    function FormBuilder(props) {
        _classCallCheck(this, FormBuilder);

        var _this = _possibleConstructorReturn(this, (FormBuilder.__proto__ || Object.getPrototypeOf(FormBuilder)).call(this, props));

        _this.state = _this.initState(props);
        _this.asyncValidators = _this.createAsyncValidators(props);
        _this.asyncValidationRunner = props.asyncValidationRunner || new AsyncValidatorRunner();

        _this.getFieldProp = _this.getFieldProp.bind(_this);
        _this.getStateClone = _this.getStateClone.bind(_this);
        return _this;
    }

    /**
     * Called by React when the component receives new props, but not on the initial render.
     *
     * State is calculated based on the incoming props, in such a way that existing form fields
     * are updated as necessary, but not overridden. See the initState function for details.
     *
     * @param props
     */


    _createClass(FormBuilder, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
            var _this2 = this;

            this.asyncValidators = this.createAsyncValidators(props);

            var clonedState = this.getStateClone();

            props.fields
            // Only check fields that are set on the component state
            .filter(function (field) {
                return _this2.state && _this2.state.fields && _this2.state.fields[field.name];
            })
            // Filter out fields where the values changed
            .filter(function (field) {
                return field.value !== _this2.state.fields[field.name].value;
            })
            // Change field value and run validators for the field
            .forEach(function (field) {
                clonedState.fields[field.name].value = field.value;
                _this2.validateField(clonedState, field.name, field.value);
            });

            this.setState(clonedState);
        }

        /**
         * Custom state deep copy function
         *
         * @returns {{form: {pristine: (boolean), valid: (boolean), validating: (boolean)}, fields: *}}
         */

    }, {
        key: 'getStateClone',
        value: function getStateClone() {
            var _this3 = this;

            return {
                form: {
                    pristine: this.state.form.pristine,
                    valid: this.state.form.valid,
                    validating: this.state.form.validating
                },
                fields: Object.keys(this.state.fields).reduce(function (p, c) {
                    p[c] = {
                        pristine: _this3.state.fields[c].pristine,
                        validating: _this3.state.fields[c].validating,
                        valid: _this3.state.fields[c].valid,
                        value: _this3.state.fields[c].value,
                        error: _this3.state.fields[c].error
                    };
                    return p;
                }, {})
            };
        }

        /**
         * Render the form fields.
         *
         * @returns {*} An array containing markup for each form field
         */

    }, {
        key: 'renderFields',
        value: function renderFields() {
            var _this4 = this;

            var styles = {
                field: {
                    position: 'relative'
                },
                progress: this.props.validatingProgressStyle,
                validatingErrorStyle: {
                    color: 'orange'
                }
            };

            return this.props.fields.map(function (field) {
                var _ref = field.props || {},
                    errorTextProp = _ref.errorTextProp,
                    props = _objectWithoutProperties(_ref, ['errorTextProp']);

                var fieldState = _this4.state.fields[field.name] || {};

                var changeHandler = _this4.handleFieldChange.bind(_this4, field.name);

                var onBlurChangeHandler = props.changeEvent === 'onBlur' ? function (e) {
                    var stateClone = _this4.updateFieldState(_this4.getStateClone(), field.name, { value: e.target.value });
                    _this4.validateField(stateClone, field.name, e.target.value);
                    _this4.setState(stateClone);
                } : undefined;

                var errorText = fieldState && fieldState.validating ? field.validatingLabelText || _this4.props.validatingLabelText : errorTextProp;

                return React.createElement(
                    'div',
                    { key: field.name, style: Object.assign({}, styles.field, _this4.props.fieldWrapStyle) },
                    fieldState.validating ? React.createElement(CircularProgres, { mode: 'indeterminate', size: 0.33, style: styles.progress }) : undefined,
                    React.createElement(field.component, _extends({
                        value: fieldState.value,
                        onChange: props.changeEvent && props.changeEvent === 'onBlur' ? onBlurChangeHandler : changeHandler,
                        onBlur: props.changeEvent && props.changeEvent === 'onBlur' ? changeHandler : undefined,
                        errorStyle: fieldState.validating ? styles.validatingErrorStyle : undefined,
                        errorText: fieldState.valid ? errorText : fieldState.error
                    }, props))
                );
            });
        }

        /**
         * Render the component
         *
         * @returns {XML}
         */

    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { style: this.props.style },
                this.renderFields()
            );
        }

        /**
         * Calculates initial state based on the provided props and the existing state, if any.
         *
         * @param props
         * @returns {{form: {pristine: (boolean), valid: (boolean), validating: (boolean)}, fields: *}}
         */

    }, {
        key: 'initState',
        value: function initState(props) {
            var _this5 = this;

            var state = {
                fields: props.fields.reduce(function (fields, field) {
                    var currentFieldState = _this5.state && _this5.state.fields && _this5.state.fields[field.name];
                    return Object.assign(fields, _defineProperty({}, field.name, {
                        value: currentFieldState !== undefined && !currentFieldState.pristine ? currentFieldState.value : field.value,
                        pristine: currentFieldState !== undefined ? currentFieldState.value === field.value : true,
                        validating: currentFieldState !== undefined ? currentFieldState.validating : false,
                        valid: currentFieldState !== undefined ? currentFieldState.valid : true,
                        error: currentFieldState && currentFieldState.error || undefined
                    }));
                }, {})
            };
            state.form = {
                pristine: Object.keys(state.fields).reduce(function (p, c) {
                    return p && state.fields[c].pristine;
                }, true),
                validating: Object.keys(state.fields).reduce(function (p, c) {
                    return p || state.fields[c].validating;
                }, false),
                valid: Object.keys(state.fields).reduce(function (p, c) {
                    return p && state.fields[c].valid;
                }, true)
            };
            return state;
        }

        /**
         * Create an object with a property for each field that has async validators, which is later used
         * to store Rx.Observable's for any currently running async validators
         *
         * @param props
         * @returns {*}
         */

    }, {
        key: 'createAsyncValidators',
        value: function createAsyncValidators(props) {
            var _this6 = this;

            return props.fields.filter(function (field) {
                return Array.isArray(field.asyncValidators) && field.asyncValidators.length;
            }).reduce(function (p, currentField) {
                p[currentField.name] = _this6.asyncValidators && _this6.asyncValidators[currentField.name] || undefined;
                return p;
            }, {});
        }

        /**
         * Cancel the currently running async validators for the specified field name, if any.
         *
         * @param fieldName
         */

    }, {
        key: 'cancelAsyncValidators',
        value: function cancelAsyncValidators(fieldName) {
            if (this.asyncValidators[fieldName]) {
                this.asyncValidators[fieldName].unsubscribe();
                this.asyncValidators[fieldName] = undefined;
            }
        }

        /**
         * Utility method to mutate the provided state object in place
         *
         * @param state A state object
         * @param fieldName A valid field name
         * @param fieldState Mutations to apply to the specified field name
         * @returns {*} A reference to the mutated state object for chaining
         */

    }, {
        key: 'updateFieldState',
        value: function updateFieldState(state, fieldName, fieldState) {
            var fieldProp = this.getFieldProp(fieldName);
            state.fields[fieldName] = {
                pristine: fieldState.pristine !== undefined ? !!fieldState.pristine : state.fields[fieldName].value === fieldProp.value,
                validating: fieldState.validating !== undefined ? !!fieldState.validating : state.fields[fieldName].validating,
                valid: fieldState.valid !== undefined ? !!fieldState.valid : state.fields[fieldName].valid,
                error: fieldState.error,
                value: fieldState.value !== undefined ? fieldState.value : state.fields[fieldName].value
            };

            // Form state is a composite of field states
            var fieldNames = Object.keys(state.fields);
            state.form = {
                pristine: fieldNames.reduce(function (p, current) {
                    return p && state.fields[current].pristine;
                }, true),
                validating: fieldNames.reduce(function (p, current) {
                    return p || state.fields[current].validating;
                }, false),
                valid: fieldNames.reduce(function (p, current) {
                    return p && state.fields[current].valid;
                }, true)
            };

            return state;
        }

        /**
         * Field value change event
         *
         * This is called whenever the value of the specified field has changed. This will be the onChange event handler, unless
         * the changeEvent prop for this field is set to 'onBlur'.
         *
         * The change event is processed as follows:
         *
         * - If the value hasn't actually changed, processing stops
         * - The field status is set to [not pristine]
         * - Any currently running async validators are cancelled
         *
         * - All synchronous validators are called in the order specified
         * - If a validator fails:
         *    - The field status is set to invalid
         *    - The field error message is set to the error message for the validator that failed
         *    - Processing stops
         *
         * - If all synchronous validators pass:
         *    - The field status is set to [valid]
         *    - If there are NO async validators for the field:
         *       - The onUpdateField callback is called, and processing is finished
         *
         * - If there ARE async validators for the field:
         *    - All async validators are started immediately
         *    - The field status is set to [valid, validating]
         *    - The validators keep running asynchronously, but the handleFieldChange function terminates
         *
         * - The async validators keep running in the background until ONE of them fail, or ALL of them succeed:
         * - The first async validator to fail causes all processing to stop:
         *    - The field status is set to [invalid, not validating]
         *    - The field error message is set to the value that the validator rejected with
         * - If all async validators complete successfully:
         *    - The field status is set to [valid, not validating]
         *    - The onUpdateField callback is called
         *
         * @param fieldName The name of the field that changed.
         * @param event An event object. Only `event.target.value` is used.
         */

    }, {
        key: 'handleFieldChange',
        value: function handleFieldChange(fieldName, event) {
            var _this7 = this;

            var newValue = event.target.value;

            var field = this.getFieldProp(fieldName);

            // If the field has changeEvent=onBlur the change handler is triggered whenever the field loses focus.
            // So if the value didn't actually change, abort the change handler here.
            if (field.props && field.props.changeEvent === 'onBlur' && newValue === field.value) {
                return;
            }

            // Using custom clone function to maximize speed, albeit more error prone
            var stateClone = this.getStateClone();

            // Update value, and set pristine to false
            this.setState(this.updateFieldState(stateClone, fieldName, { pristine: false, value: newValue }), function () {
                if (!isObject(newValue) && newValue === (field.value ? field.value : '')) {
                    _this7.props.onUpdateField(fieldName, newValue);
                    return;
                }

                // Cancel async validators in progress (if any)
                if (_this7.asyncValidators[fieldName]) {
                    _this7.cancelAsyncValidators(fieldName);
                    _this7.setState(_this7.updateFieldState(stateClone, fieldName, { validating: false }));
                }

                // Run synchronous validators
                var validatorResult = _this7.validateField(stateClone, fieldName, newValue);

                // Async validators - only run if sync validators pass
                if (validatorResult === true) {
                    _this7.runAsyncValidators(field, stateClone, fieldName, newValue);
                } else {
                    // Sync validators failed set field status to false
                    _this7.setState(_this7.updateFieldState(stateClone, fieldName, { valid: false, error: validatorResult }), function () {
                        // Also emit when the validator result is false
                        _this7.props.onUpdateFormStatus(_this7.state.form);
                        _this7.props.onUpdateField(fieldName, newValue);
                    });
                }
            });
        }
    }, {
        key: 'runAsyncValidators',
        value: function runAsyncValidators(field, stateClone, fieldName, newValue) {
            var _this8 = this;

            if ((field.asyncValidators || []).length > 0) {
                // Set field and form state to 'validating'
                this.setState(this.updateFieldState(stateClone, fieldName, { validating: true }), function () {
                    _this8.props.onUpdateFormStatus(_this8.state.form);
                    _this8.props.onUpdateField(fieldName, newValue);

                    // TODO: Subscription to validation results could be done once in `componentDidMount` and be
                    // disposed in the `componentWillUnmount` method. This way we don't have to create the
                    // subscription every time the field is changed.
                    _this8.asyncValidators[fieldName] = _this8.asyncValidationRunner.listenToValidatorsFor(fieldName).subscribe(function (status) {
                        _this8.setState(_this8.updateFieldState(_this8.getStateClone(), status.fieldName, {
                            validating: false,
                            valid: status.isValid,
                            error: status.message
                        }), function () {
                            _this8.cancelAsyncValidators(status.fieldName);
                            _this8.props.onUpdateFormStatus(_this8.state.form);
                        });
                    });

                    _this8.asyncValidationRunner.run(fieldName, field.asyncValidators, newValue);
                });
            } else {
                this.setState(this.updateFieldState(stateClone, fieldName, { valid: true }), function () {
                    _this8.props.onUpdateFormStatus(_this8.state.form);
                    _this8.props.onUpdateField(fieldName, newValue);
                });
            }
        }

        /**
         * Run all synchronous validators (if any) for the field and value, and update the state clone depending on the
         * outcome
         *
         * @param stateClone A clone of the current state
         * @param fieldName The name of the field to validate
         * @param newValue The value to validate
         * @returns {true|String} The error message from the first validator that fails, or true if they all pass
         */

    }, {
        key: 'validateField',
        value: function validateField(stateClone, fieldName, newValue) {
            var field = this.getFieldProp(fieldName);

            var validatorResult = (field.validators || []).reduce(function (pass, currentValidator) {
                return pass === true ? currentValidator.validator(newValue) === true || currentValidator.message : pass;
            }, true);

            this.updateFieldState(stateClone, fieldName, {
                valid: validatorResult === true,
                error: validatorResult === true ? undefined : validatorResult
            });

            return validatorResult;
        }

        /**
         * Retreive the field that has the specified field name
         *
         * @param fieldName
         * @returns {}
         */

    }, {
        key: 'getFieldProp',
        value: function getFieldProp(fieldName) {
            return this.props.fields.filter(function (f) {
                return f.name === fieldName;
            })[0];
        }
    }]);

    return FormBuilder;
}(React.Component);

/**
 * Component prop types
 * @type {{fields: (Object|isRequired), validatingLabelText: *, validatingProgressStyle: *, onUpdateField: (Function|isRequired)}}
 */


FormBuilder.propTypes = {
    fields: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.any,
        component: React.PropTypes.func.isRequired,
        props: React.PropTypes.shape({
            changeEvent: React.PropTypes.oneOf(['onChange', 'onBlur'])
        }),
        validators: React.PropTypes.arrayOf(React.PropTypes.shape({
            validator: React.PropTypes.func.isRequired,
            message: React.PropTypes.string.isRequired
        })),
        asyncValidators: React.PropTypes.arrayOf(React.PropTypes.func.isRequired),
        validatingLabelText: React.PropTypes.string
    })).isRequired,
    validatingLabelText: React.PropTypes.string,
    validatingProgressStyle: React.PropTypes.object,
    onUpdateField: React.PropTypes.func.isRequired,
    onUpdateFormStatus: React.PropTypes.func,
    style: React.PropTypes.object,
    fieldWrapStyle: React.PropTypes.object
};

/**
 * Default values for optional props
 * @type {{validatingLabelText: string, validatingProgressStyle: {position: string, right: number, top: number}}}
 */
FormBuilder.defaultProps = {
    validatingLabelText: 'Validating...',
    validatingProgressStyle: {
        position: 'absolute',
        right: -12,
        top: 16
    },
    onUpdateFormStatus: noop
};

export default FormBuilder;
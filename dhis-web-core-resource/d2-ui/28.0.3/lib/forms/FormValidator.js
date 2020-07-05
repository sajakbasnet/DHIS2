var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import Rx from 'rxjs';
import log from 'loglevel';
import { isFunction } from 'lodash/fp';

export var FormFieldStatuses = {
    VALID: 'VALID',
    INVALID: 'INVALID',
    VALIDATING: 'VALIDATING'
};

function identity(val) {
    return val;
}

function getAllPromiseValues(promises) {
    return Promise.all(promises.map(function (promise) {
        return promise.then(identity, identity);
    }));
}

function validatorRunner(fieldName, fieldValue, formSource) {
    return function runValidator(validator) {
        var result = void 0;

        try {
            result = validator(fieldValue, fieldName, formSource);
        } catch (e) {
            log.debug('Validator for \'' + fieldName + '\' ignored because the validator threw an error.');
            log.debug('' + validator);
            log.debug(e.message);
            return Promise.resolve(true);
        }

        if (result === false) {
            return Promise.reject(validator.message);
        }

        return Promise.resolve(result);
    };
}

function awaitAsyncValidators(accumulator, validatorPromise, index, validators) {
    if (validatorPromise) {
        accumulator.push(validatorPromise);
    }

    if (validators.length === 0 || validators.length === index + 1) {
        return getAllPromiseValues(accumulator);
    }
    return accumulator;
}

function grabErrorMessages(validationStatuses) {
    return validationStatuses.filter(function (s) {
        return s !== true;
    });
}

function getFieldStatus() {
    var statusMessages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return {
        status: statusMessages.length === 0 ? FormFieldStatuses.VALID : FormFieldStatuses.INVALID,
        messages: statusMessages
    };
}

export default function createFormValidator() {
    var fieldConfigs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var scheduler = arguments[1];

    var validatorQueue = new Rx.Subject();
    var statusSubject = new Rx.ReplaySubject(1);
    var initialStatuses = fieldConfigs.filter(function (fieldConfig) {
        return Array.isArray(fieldConfig.validators) && fieldConfig.validators.length > 0;
    }).map(function (fc) {
        return [fc.name, { status: FormFieldStatuses.VALID, messages: [] }];
    });
    var formFieldStatuses = new Map(initialStatuses);

    var validatorQueues = new Map(initialStatuses.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            name = _ref2[0];

        return [name, new Rx.Subject()];
    }));
    Array.from(validatorQueues.values()).forEach(function (validatorObservable) {
        validatorObservable.debounceTime(300, scheduler).map(function (_ref3) {
            var fieldName = _ref3.fieldName,
                fieldValue = _ref3.fieldValue,
                formSource = _ref3.formSource;

            var fieldConfig = fieldConfigs.filter(function (fc) {
                return fc.name === fieldName;
            }).shift();

            validatorQueue.next(Promise.resolve({ fieldName: fieldName, fieldStatus: { status: FormFieldStatuses.VALIDATING, messages: [] } }));

            var validatorToRun = fieldConfig.validators.filter(function (validator) {
                if (!isFunction(validator)) {
                    log.warn('Warning: One of the validators for \'' + fieldName + '\' is not a function.');
                    return false;
                }
                return isFunction(validator);
            }).map(validatorRunner(fieldName, fieldValue, formSource));

            if (!validatorToRun.length) {
                return Promise.resolve({
                    fieldName: fieldName,
                    fieldStatus: getFieldStatus()
                });
            }

            return validatorToRun.reduce(awaitAsyncValidators, []).then(grabErrorMessages).then(function (errorMessages) {
                return {
                    fieldName: fieldName,
                    fieldStatus: getFieldStatus(errorMessages)
                };
            }).catch(log.error);
        }).concatAll().subscribe(function (_ref4) {
            var fieldName = _ref4.fieldName,
                fieldStatus = _ref4.fieldStatus;

            formFieldStatuses.set(fieldName, fieldStatus);
            statusSubject.next(formFieldStatuses);
        });
    });

    validatorQueue.concatAll().subscribe(function (fieldValidatorStatus) {
        var fieldName = fieldValidatorStatus.fieldName,
            fieldStatus = fieldValidatorStatus.fieldStatus;

        formFieldStatuses.set(fieldName, fieldStatus);
        statusSubject.next(formFieldStatuses);
    });

    var formValidator = {
        status: statusSubject.debounceTime(100),

        setStatus: function setStatus(status) {
            statusSubject.next(status);
        },


        /**
         * Start a validation run for a specific field with a provided value. This runs sync and async validators
         * and reports the status back using the `formValidator.status` observable.
         *
         * @param {String} fieldName Name of the field to run the validator for.
         * @param {String} fieldValue Value of the field to run the validator for.
         * @returns {boolean} Returns true when a validator run has started, otherwise false.
         *
         * @example
         * ```js
         *   formValidator.runFor('name', 'Mark');
         * ```
         */
        runFor: function runFor(fieldName, fieldValue, formSource) {
            if (validatorQueues.has(fieldName)) {
                validatorQueues.get(fieldName).next({ fieldName: fieldName, fieldValue: fieldValue, formSource: formSource });
                return true;
            }
            return false;
        },


        /**
         * Returns the current status for the passed field.
         *
         * @param {String} fieldName Name of the field. Generally this is the `name` property on the `fieldConfig`
         * @returns {Object} Status object with a `status` and a `messages` property.
         *
         * @example
         * ```js
         *   formValidator.getStatusFor('password')
         *   // {
         *   //   status: FormFieldStatuses.VALID,
         *   //   messages: []
         *   // }
         * ```
         */
        getStatusFor: function getStatusFor(fieldName) {
            if (formFieldStatuses.has(fieldName)) {
                return formFieldStatuses.get(fieldName);
            }

            return {
                status: FormFieldStatuses.VALID,
                messages: []
            };
        }
    };

    return formValidator;
}
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { Observable, Subject } from 'rx';

/**
 * Run `validatorFunctions` in parallel and returns a resolved `Promise` with the validation status.
 * @param {function:Promise[]} validatorFunctions Array of validator functions that return a Promise.
 * @param {*} value The value that should be checked by the given validators
 * @returns {Promise.<Object>} Resolves promise with `{ isValid: true }` when validators passed
 * or with `{ isValid: false, message: '<error_message>'`} when one of the validators failed. The `message` property
 * contains the value that the failed validator function rejected with.
 */
function runValidatorFunctions(validatorFunctions, value) {
    return Promise.all(validatorFunctions.map(function (validator) {
        return validator.call(null, value);
    }))
    // All validators passed
    .then(function () {
        return { isValid: true };
    })
    // When one of the validators failed a failure status with error message are emitted
    .catch(function (errorMessage) {
        return { isValid: false, message: errorMessage };
    });
}

/**
 *
 */

var AsyncValidatorRunner = function () {
    /**
     *
     * @param {Rx.Scheduler} [scheduler] Optional scheduler to be used for the Rx methods that can accept one.
     */
    function AsyncValidatorRunner(scheduler) {
        _classCallCheck(this, AsyncValidatorRunner);

        // Rx.Scheduler to be used to run the operations on
        this.scheduler = scheduler;

        // Rx.Subject that will serve as the validator pipeline
        // The Runner passes the fields and values and emits
        // success
        this.validatorPipeline = new Subject();

        // The amount of time to be used for debouncing the field values
        this.debounceTimeInMs = 400;
    }

    /**
     * Run the `asyncValidators` passed for the field with `fieldName`. `fieldName` is only
     * used to pass through to the result so `listenToValidatorsFor` can identify which field
     * the result belong to.
     *
     * @param {string} fieldName The name of the field
     * @param {Array<Function>} asyncValidators An array of functions that each return a Promise thar resolves on valid
     * and rejects on failure.
     * @param {*} value The value that should be checked for validity.
     *
     * @returns {AsyncValidatorObject} Returns itself for chaining purposes
     */


    _createClass(AsyncValidatorRunner, [{
        key: 'run',
        value: function run(fieldName) {
            var asyncValidators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var value = arguments[2];

            this.validatorPipeline.onNext({ fieldName: fieldName, asyncValidators: asyncValidators, value: value });

            return this;
        }

        /**
         * Returns an Rx.Observable that can be subscribed to to be updated of validation results for the field
         * with `fieldName`. This function when subscribing runs the validators that are passed for the given field when
         * `run` was called. This allows for only running the validators that are at the time the validation request was
         * issued were applicable to the field.
         *
         * @param {string} fieldName The name of the field to filter statuses for.
         * @returns {Rx.Observable} Observable that represents validation results for the given `fieldName`.
         */

    }, {
        key: 'listenToValidatorsFor',
        value: function listenToValidatorsFor(fieldName) {
            return this.validatorPipeline
            // Filter the values by fieldName to make sure we only deal with the values for the requested field
            .filter(function (field) {
                return field.fieldName === fieldName;
            })
            // Only process the latest value within the specified time window
            .debounce(this.debounceTimeInMs, this.scheduler).map(function (field) {
                return Observable.fromPromise(runValidatorFunctions(field.asyncValidators, field.value)).map(function (status) {
                    return Object.assign(status, { fieldName: field.fieldName, value: field.value });
                });
            })
            // Flatten all observables in the correct order they should be processed
            .concatAll();
        }

        /**
         * Creates an instance of the AsyncValidatorRunner class
         *
         * @param {Rx.Scheduler} scheduler A scheduler to be used while running the pipeline operations
         * @returns {AsyncValidatorRunner} The instantiated runner
         * @static
         */

    }], [{
        key: 'create',
        value: function create(scheduler) {
            return new AsyncValidatorRunner(scheduler);
        }
    }]);

    return AsyncValidatorRunner;
}();

export default AsyncValidatorRunner;
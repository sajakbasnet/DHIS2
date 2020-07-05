var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { ReplaySubject, Observable } from 'rx';

var publishState = Symbol('publishState');
var publishError = Symbol('publishError');

var observableSymbol = Symbol('observable');

var Store = function (_Observable) {
    _inherits(Store, _Observable);

    function Store(initialValue) {
        _classCallCheck(this, Store);

        var _this = _possibleConstructorReturn(this, (Store.__proto__ || Object.getPrototypeOf(Store)).call(this));

        _this[observableSymbol] = new ReplaySubject(1);

        if (initialValue) {
            Promise.resolve(initialValue).then(function (value) {
                _this.setState(value);
            }).catch(function (error) {
                _this[publishError](error);
            });
        }
        return _this;
    }

    _createClass(Store, [{
        key: 'setState',
        value: function setState(newState) {
            this.state = newState;
            this[publishState]();
        }
    }, {
        key: 'getState',
        value: function getState() {
            return this.state;
        }
    }, {
        key: 'setSource',
        value: function setSource(observableSource) {
            var _this2 = this;

            observableSource.subscribe(function (value) {
                return _this2.setState(value);
            }, function (error) {
                return _this2[publishError]('Rethrown error from source: ' + error);
            });
        }
    }, {
        key: '_subscribe',
        value: function _subscribe(observer) {
            return this[observableSymbol].subscribe(observer);
        }

        /** ***************************************************************************************************************
         * Private methods
         *****************************************************************************************************************/

    }, {
        key: publishState,
        value: function value() {
            return this[observableSymbol].onNext(this.state);
        }
    }, {
        key: publishError,
        value: function value(error) {
            return this[observableSymbol].onError(error);
        }

        /** ***************************************************************************************************************
         * Static methods
         *****************************************************************************************************************/

    }], [{
        key: 'create',
        value: function create(storeConfig) {
            var initialState = void 0;
            var mergeObject = {};

            if (storeConfig) {
                if (storeConfig.getInitialState) {
                    initialState = storeConfig && storeConfig.getInitialState();
                }

                Object.keys(storeConfig).filter(function (keyName) {
                    return keyName !== 'getInitialState';
                }).forEach(function (keyName) {
                    mergeObject[keyName] = storeConfig[keyName];
                    return mergeObject;
                });
            }

            return Object.assign(new Store(initialState), mergeObject);
        }
    }]);

    return Store;
}(Observable);

export default Store;
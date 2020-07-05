var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

var TreeView = function (_React$Component) {
    _inherits(TreeView, _React$Component);

    function TreeView(props) {
        _classCallCheck(this, TreeView);

        var _this = _possibleConstructorReturn(this, (TreeView.__proto__ || Object.getPrototypeOf(TreeView)).call(this, props));

        _this.state = {
            collapsed: !props.initiallyExpanded,
            hasBeenExpanded: props.initiallyExpanded
        };

        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }

    _createClass(TreeView, [{
        key: 'toggleCollapsed',
        value: function toggleCollapsed() {
            var _this2 = this;

            this.setState(function (state) {
                return {
                    collapsed: !state.collapsed,
                    hasBeenExpanded: true
                };
            }, function () {
                if (!_this2.state.collapsed && typeof _this2.props.onExpand === 'function') {
                    _this2.props.onExpand();
                }
            });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
            // When initiallyExpanded status changed and the tree is collapsed we fire a toggleEvent to open it up
            if (newProps.initiallyExpanded && this.state.collapsed) {
                this.toggleCollapsed();
            }
        }
    }, {
        key: 'handleClick',
        value: function handleClick(e) {
            if (this.props.onClick) {
                this.props.onClick(e);
            }
            if (e !== undefined) {
                e.stopPropagation();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var styles = {
                tree: {
                    marginLeft: 16,
                    whiteSpace: 'nowrap'
                },
                itemLabel: {
                    display: 'inline-block',
                    position: 'relative'
                },
                arrow: {
                    display: 'inline-block',
                    position: 'absolute',
                    left: -16,
                    top: -1,
                    width: 11,
                    height: 16,
                    paddingLeft: 4,
                    textAlign: 'center',
                    cursor: 'pointer'
                },
                arrowSymbol: {
                    transition: 'transform 150ms ease-out',
                    transform: this.state.collapsed ? '' : 'rotate(90deg)',
                    position: 'absolute'
                },
                clickTarget: {
                    cursor: this.props.onClick && 'pointer'
                },
                children: {
                    position: 'relative',
                    marginLeft: 16,
                    height: this.state.collapsed ? 0 : 'inherit'
                }
            };

            var label = React.createElement(
                'div',
                { style: styles.itemLabel },
                React.createElement(
                    'div',
                    { className: 'arrow', style: styles.arrow, onClick: this.toggleCollapsed.bind(this) },
                    React.createElement(
                        'div',
                        { style: styles.arrowSymbol },
                        this.props.arrowSymbol
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'label', onClick: this.handleClick, style: styles.clickTarget },
                    this.props.label
                )
            );

            styles.children.display = this.state.collapsed ? 'none' : 'block';

            // Render children if not collapsed, or (persistent and has been expanded)
            var children = (!this.state.collapsed || this.props.persistent && this.state.hasBeenExpanded) && React.createElement(
                'div',
                { className: 'children', style: styles.children },
                this.props.children
            );

            var className = 'tree-view ' + this.props.className;
            return React.createElement(
                'div',
                { className: className, style: Object.assign(styles.tree, this.props.style) },
                label,
                children
            );
        }
    }]);

    return TreeView;
}(React.Component);

// TODO: Documentation


TreeView.propTypes = {
    label: React.PropTypes.node.isRequired,
    children: React.PropTypes.node,
    persistent: React.PropTypes.bool,
    initiallyExpanded: React.PropTypes.bool,
    arrowSymbol: React.PropTypes.node,
    style: React.PropTypes.object,
    className: React.PropTypes.string,

    onExpand: React.PropTypes.func,
    onClick: React.PropTypes.func
};

TreeView.defaultProps = {
    persistent: false,
    initiallyExpanded: false,
    arrowSymbol: '▸',
    style: {}
};

export default TreeView;
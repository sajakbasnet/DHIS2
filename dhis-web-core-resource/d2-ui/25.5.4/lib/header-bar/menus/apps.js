'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getApplicationMenu;
function getApplicationMenu() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return {
        name: 'applications',
        dataSource: '/dhis-web-commons/menu/getModules.action',
        options: {
            searchable: !options.isMobile,
            scrollable: true,
            extraLink: {
                text: 'more_applications',
                url: '../dhis-web-commons-about/modules.action'
            },
            shortCut: 'm'
        }
    };
}
"use strict";
var core_1 = require('@angular/core');
function createComponentFactory(resolver, metadata) {
    var cmpClass = (function () {
        function DynamicComponent() {
        }
        return DynamicComponent;
    }());
    var decoratedCmp = core_1.Component(metadata)(cmpClass);
    return resolver.resolveComponentFactory(decoratedCmp);
}
exports.createComponentFactory = createComponentFactory;
var RwtModuleConfig = (function () {
    function RwtModuleConfig() {
    }
    return RwtModuleConfig;
}());
exports.RwtModuleConfig = RwtModuleConfig;
//# sourceMappingURL=shared.js.map